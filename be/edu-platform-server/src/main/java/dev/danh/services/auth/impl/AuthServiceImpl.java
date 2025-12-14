package dev.danh.services.auth.impl;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import dev.danh.entities.dtos.request.*;
import dev.danh.entities.dtos.response.AuthenticationResponse;
import dev.danh.entities.dtos.response.IntrospectResponse;
import dev.danh.entities.models.InvalidToken;
import dev.danh.entities.models.RefreshToken;
import dev.danh.entities.models.User;
import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import dev.danh.mapper.UserMapper;
import dev.danh.repositories.auth.RefreshTokenRepository;
import dev.danh.repositories.user.InvalidTokenRepository;
import dev.danh.repositories.user.UserRepository;
import dev.danh.services.auth.AuthService;
import dev.danh.utils.MailService;
import jakarta.mail.MessagingException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.security.MessageDigest;
import java.text.ParseException;
import java.util.Base64;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@RequiredArgsConstructor
@FieldDefaults(makeFinal = true, level = AccessLevel.PRIVATE)
@Service
public class AuthServiceImpl implements AuthService {
    @NonFinal
    @Value("${URL_FRONTEND}")
    String URL_FRONTEND;

    MailService mailService;

    private static final Logger log = LogManager.getLogger(AuthServiceImpl.class);
    InvalidTokenRepository invalidTokenRepository;
    UserMapper userMapper;
    UserRepository userRepository;
    RefreshTokenRepository refreshTokenRepository;
    @Value("${jwt.secret}")
    @NonFinal
    String SECRET_KEY; // Replace with a secure key
    @Value("${jwt.expiration}")
    @NonFinal
    Long EXPIRATION_TIME; // Replace with your desired expiration time in milliseconds
    @Value("${jwt.refresh-expiration-remember-me}")
    @NonFinal
    Long REFRESH_EXPIRATION_TIME_REMEMBER_ME; // Replace with your desired refresh token expiration time in milliseconds
    @Value("${jwt.refresh-expiration}")
    @NonFinal
    Long REFRESH_EXPIRATION_TIME;

    @Override
    /**
     * Authenticates a user with the provided username and password.
     * @param request The authentication request containing username and password.
     * @return An AuthenticationResponse containing the access token, refresh token, and user details.
     * @throws AppException if the user is not found or credentials are invalid.
     */
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        } else {
            //If user found
            if (user.getIsActive()) {
                return AuthenticationResponse.builder()
                        .accessToken(generateToken(user))
                        .authenticated(true)
                        .userResponse(userMapper.toUserResponse(user))
                        .refreshToken(generateRefreshToken(request.getRememberMe(), user, request.getDeviceInfo()))
                        .refreshTokenDuration(request.getRememberMe() ? REFRESH_EXPIRATION_TIME_REMEMBER_ME : REFRESH_EXPIRATION_TIME)
                        .build();
            } else {
                throw new AppException(ErrorCode.USER_BANNED);
            }
        }
    }

    @Override
    /**
     * Authenticates a user using Google credentials.
     * @param request The authentication request containing Google email and provider ID.
     * @return An AuthenticationResponse containing the access token, refresh token, and user details.
     * @throws AppException if the user is not found.
     */
    public AuthenticationResponse authenticate(AuthenticationGoogleRequest request) {
        User user = userRepository
                .findByEmailAndProviderId(request.getEmail(), request.getProvideId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        //If user found
        if (user.getIsActive()) {
            return AuthenticationResponse.builder()
                    .accessToken(generateToken(user))
                    .authenticated(true)
                    .userResponse(userMapper.toUserResponse(user))
                    .refreshToken(generateRefreshToken(false, user, request.getDeviceInfo()))
                    .build();
        } else {
            throw new AppException(ErrorCode.USER_BANNED);
        }
    }

    @Override
    /**
     * Initiates the password reset process for a given email.
     * @param email The email of the user requesting a password reset.
     * @return True if the reset email was sent successfully, false otherwise.
     * @throws MessagingException if there is an error sending the email.
     */
    public Boolean resetPassword(String email) throws MessagingException {
        //Generate reset link
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        String token = UUID.randomUUID().toString();
        String hashToken = hashToken(token);
        user.setResetTokenHash(hashToken);
        userRepository.save(user);
        //Send email
        String resetLink = generateResetLink(token);
        mailService.sendMail(user.getFullName(), resetLink, user.getEmail(), "Reset your password");
        return true;
    }

    @Override
    /**
     * Updates the user's password using a reset token.
     * @param token The reset token received by the user.
     * @param newPassword The new password to set.
     * @return True if the password was updated successfully, false otherwise.
     */
    public Boolean updatePassword(String token, String newPassword) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);
        //Verify token
        String hashToken = hashToken(token);
        var user = userRepository.findByResetTokenHash(hashToken).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (user != null) {
            user.setPassword(passwordEncoder.encode(newPassword));
            user.setResetTokenHash(null);
            userRepository.save(user);
            return true;
        }
        return false;
    }


    @Transactional
    @Override
    public Boolean logOutDevice(LogOutDeviceRequest request) {
        var refreshToken = refreshTokenRepository.findByToken(request.getDeviceRefreshToken()).orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));
        refreshTokenRepository.deleteByToken(refreshToken.getToken());
        return true;
    }

    @Override
    /**
     * Introspects an access token to check its validity.
     * @param request The introspect request containing the access token.
     * @return An IntrospectResponse indicating whether the token is valid.
     */
    public IntrospectResponse introspect(IntrospectRequest request) {
        Boolean valid = true;
        String token = request.getToken();
        try {
            var signedJWT = verifyToken(token);
        } catch (AppException e) {
            valid = false;
        }
        return IntrospectResponse.builder()
                .valid(valid)
                .build();
    }

    @Override
    /**
     * Logs out a user by invalidating their access token and refresh token.
     * @param request The logout request containing the access token and refresh token.
     */
    public void logout(LogoutRequest request) {
        try {
            var verifyToken = verifyToken(request.getAccessToken());
            String jid = verifyToken.getJWTClaimsSet().getJWTID();
            Date expiryDate = verifyToken.getJWTClaimsSet().getExpirationTime();
            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jid)
                    .expiryTime(expiryDate)
                    .build();
            //save expireDate token to db
            invalidTokenRepository.save(invalidToken);
            refreshTokenRepository.deleteById(request.getRefreshToken());
        } catch (AppException | ParseException e) {
            log.info("Token already invalidated");
        }

    }

    @Override
    /**
     * Refreshes an access token using a refresh token.
     * @param token The refresh token.
     * @return An AuthenticationResponse containing a new access token, a new refresh token, and user details.
     * @throws ParseException if there is an error parsing the token.
     */
    @Transactional
    public AuthenticationResponse refreshToken(String token) throws ParseException {
        log.info("Refresh token {}", token);
        var oldRefreshToken = refreshTokenRepository.findById(token).orElseThrow(() -> {
            throw new AppException(ErrorCode.INVALID_REFRESH_TOKEN);
        });
        refreshTokenRepository.deleteByToken(token);
        // Retrieve user from the user id in old refresh token
        UUID userId = oldRefreshToken.getUserId();
        String refreshToken = UUID.randomUUID().toString();
        refreshTokenRepository.save(RefreshToken.builder()
                .token(refreshToken)
                .userId(userId)
                .expiryDate(new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME_REMEMBER_ME))
                .deviceInfo(oldRefreshToken.getDeviceInfo())
                .build()
        );
        User user = userRepository.findById(oldRefreshToken.getUserId()).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return AuthenticationResponse.builder()
                .accessToken(generateToken(user))
                .authenticated(true)
                .userResponse(userMapper.toUserResponse(user))
                .refreshToken(refreshToken)
                .refreshTokenDuration(REFRESH_EXPIRATION_TIME_REMEMBER_ME)
                .build();

    }


    /**
     * Verifies the authenticity and validity of a signed JWT.
     *
     * @param token The signed JWT string.
     * @return The verified SignedJWT object.
     * @throws AppException if the token is invalid or verification fails.
     */
    public SignedJWT verifyToken(String token) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            var isValid = signedJWT.verify(verifier);
            Date expirationTime =
                    signedJWT
                            .getJWTClaimsSet()
                            .getExpirationTime();
            if (isValid && expirationTime != null && expirationTime.after(new Date())) {
                return signedJWT;
            } else {
                throw new AppException(ErrorCode.INVALID_TOKEN);
            }
        } catch (ParseException | JOSEException e) {
            throw new AppException(ErrorCode.INVALID_TOKEN);
        }
    }


    /**
     * Generates a new access token for the given user.
     *
     * @param user The user for whom to generate the token.
     * @return The generated JWT access token string.
     */
    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS256);

        JWTClaimsSet claimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("dev.danh")
                .expirationTime(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(user))
                .build();
        // Here you would sign the token with your secret key and return it
        Payload payload = new Payload(claimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);
        try {
            jwsObject.sign(new MACSigner(SECRET_KEY.getBytes()));
        } catch (JOSEException e) {
            throw new RuntimeException("Error signing JWT", e);
        }
        return jwsObject.serialize();
    }

    /**
     * Generates a new refresh token for the given user.
     *
     * @param rememberMe A boolean indicating whether the "remember me" option is selected, affecting token expiration.
     * @param user       The user for whom to generate the refresh token.
     * @return The generated refresh token string.
     */
    private String generateRefreshToken(Boolean rememberMe, User user, String deviceInfo) {
        String refreshToken = UUID.randomUUID().toString();
        Date expiryDate = rememberMe ?
                new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME_REMEMBER_ME)
                : new Date(System.currentTimeMillis() + REFRESH_EXPIRATION_TIME);
        refreshTokenRepository.save(RefreshToken.builder()
                .token(refreshToken)
                .userId(user.getId())
                .expiryDate(expiryDate)
                .deviceInfo(deviceInfo)
                .build()
        );
        return refreshToken;
    }

    /**
     * Builds the scope string for a JWT based on the user's roles and permissions.
     *
     * @param user The user object containing roles and permissions.
     * @return A space-separated string of roles and permissions.
     */
    private String buildScope(User user) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        if (user.getRoles() != null && !user.getRoles().isEmpty()) {
            user.getRoles().forEach(role -> {
                        stringJoiner.add("ROLE_" + role.getName());
                        if (!CollectionUtils.isEmpty(role.getPermissions())) {
                            role.getPermissions().forEach(permission -> stringJoiner.add(permission.getName()));
                        }
                    }
            );
        }
        return stringJoiner.toString();
    }

    /**
     * Generates a password reset link using the provided token.
     *
     * @param token The reset token.
     * @return The complete password reset URL.
     */
    private String generateResetLink(String token) {
        return URL_FRONTEND + "/reset-password?token=" + token;
    }

    /**
     * Hashes a given token using SHA-256.
     *
     * @param token The token string to hash.
     * @return The Base64 encoded SHA-256 hash of the token.
     * @throws RuntimeException if there is an error during hashing.
     */
    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes("UTF-8"));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception e) {
            throw new RuntimeException("Error hashing token", e);
        }
    }
}
