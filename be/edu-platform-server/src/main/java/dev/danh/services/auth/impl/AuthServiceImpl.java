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
import dev.danh.entities.models.User;
import dev.danh.enums.ErrorCode;
import dev.danh.exception.AppException;
import dev.danh.mapper.UserMapper;
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
import org.springframework.util.CollectionUtils;

import java.security.MessageDigest;
import java.text.ParseException;
import java.time.temporal.ChronoUnit;
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
    @Value("${jwt.secret}")
    @NonFinal
    String SECRET_KEY; // Replace with a secure key
    @Value("${jwt.expiration}")
    @NonFinal
    Long EXPIRATION_TIME; // Replace with your desired expiration time in milliseconds
    @Value("${jwt.refresh-expiration}")
    @NonFinal
    Long REFRESH_EXPIRATION_TIME; // Replace with your desired refresh token expiration time in milliseconds

    @Override
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        } else {
            return AuthenticationResponse.builder()
                    .token(generateToken(user))
                    .authenticated(true)
                    .userResponse(userMapper.toUserResponse(user))
                    .build();
        }
    }

    @Override
    public AuthenticationResponse authenticate(AuthenticationGoogleRequest request) {
        User user = userRepository
                .findByEmailAndProviderId(request.getEmail(), request.getProvideId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        //If user found
        return AuthenticationResponse.builder()
                .token(generateToken(user))
                .authenticated(true)
                .userResponse(userMapper.toUserResponse(user))
                .build();

    }

    @Override
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
        mailService.sendMail(user.getFullName(), resetLink, user.getEmail(),"Reset your password");
        return true;
    }

    @Override
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

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) {
        Boolean valid = true;
        String token = request.getToken();
        try {
            var signedJWT = verifyToken(token, false);
        } catch (AppException e) {
            valid = false;
        }
        return IntrospectResponse.builder()
                .valid(valid)
                .build();
    }

    @Override
    public void logout(LogoutRequest token) {
        try {
            var verifyToken = verifyToken(token.getToken(), true);
            String jid = verifyToken.getJWTClaimsSet().getJWTID();
            Date expiryDate = verifyToken.getJWTClaimsSet().getExpirationTime();
            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jid)
                    .expiryTime(expiryDate)
                    .build();
            //save expireDate token to db
            invalidTokenRepository.save(invalidToken);
        } catch (AppException | ParseException e) {
            log.info("Token already invalidated");
        }

    }

    @Override
    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException {
        var signedJWT = verifyToken(request.getToken(), true);

        InvalidToken invalidToken = InvalidToken.builder()
                .id(signedJWT.getJWTClaimsSet().getJWTID())
                .expiryTime(signedJWT.getJWTClaimsSet().getExpirationTime())
                .build();
        invalidTokenRepository.save(invalidToken);
        // Retrieve user from the database using the subject of the JWT

        User user = userRepository.findByUsername(signedJWT.getJWTClaimsSet().getSubject())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return AuthenticationResponse.builder()
                .token(generateToken(user))
                .authenticated(true)
                .userResponse(userMapper.toUserResponse(user))
                .build();

    }


    public SignedJWT verifyToken(String token, boolean refresh) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            JWSVerifier verifier = new MACVerifier(SECRET_KEY.getBytes());
            var isValid = signedJWT.verify(verifier);
            Date expirationTime = refresh ?
                    new Date(signedJWT
                            .getJWTClaimsSet()
                            .getExpirationTime()
                            .toInstant().plus(REFRESH_EXPIRATION_TIME, ChronoUnit.SECONDS).toEpochMilli())
                    :
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


    //tao scope cho token
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

    private String generateResetLink(String token) {
        return URL_FRONTEND + "/reset-password?token=" + token;
    }

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
