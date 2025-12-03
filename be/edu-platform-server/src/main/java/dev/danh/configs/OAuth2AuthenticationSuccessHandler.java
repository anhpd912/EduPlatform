package dev.danh.configs;

import dev.danh.entities.dtos.apps.CustomOAuth2User;
import dev.danh.entities.dtos.request.AuthenticationGoogleRequest;
import dev.danh.entities.dtos.response.AuthenticationResponse;
import dev.danh.entities.dtos.response.UserResponse;
import dev.danh.entities.models.Role;
import dev.danh.services.auth.impl.AuthServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j

public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final HttpServletResponse httpServletResponse;
    @Value("${URL_FRONTEND}")
    String URL_FRONTEND;
    @NonFinal
    @Value("${enable.secure}")
    Boolean ENABLE_SECURE;

    @NonFinal
    @Value("${jwt.refresh-expiration-remember-me}")
    Long REFRESH_EXPIRATION_TIME_REMEMBER_ME;
    private final AuthServiceImpl authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getEmail();

        AuthenticationGoogleRequest authRequest = AuthenticationGoogleRequest.builder().username(email.split("@")[0]).email(email).provideId(oAuth2User.getGoogleId()).build();

        AuthenticationResponse authResponse = authService.authenticate(authRequest);

        Cookie cookie = new Cookie("refreshToken", authResponse.getRefreshToken());
        cookie.setHttpOnly(true);
        cookie.setSecure(ENABLE_SECURE);    // Use 'true' for HTTPS (production), 'false' for local HTTP
        cookie.setPath("/");       // Available for entire app
        cookie.setMaxAge(REFRESH_EXPIRATION_TIME_REMEMBER_ME.intValue());
        String redirectUrl = URL_FRONTEND + "/" + getTargetUrl(authResponse);
        response.addCookie(cookie);
        // Chuyển hướng về NextJS app
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);
        clearAuthenticationAttributes(request);
    }

    private String getTargetUrl(AuthenticationResponse response) {
        UserResponse userResponse = response.getUserResponse();
        if (!userResponse.getRoles().isEmpty()) {
            Role role = userResponse.getRoles().stream().toList().get(0);
            if (role == null) {
                return "client/register-complete/" + userResponse.getId();
            }
            return "login?token=" + response.getAccessToken();
        }
        return "client/register-complete/" + userResponse.getId();
    }

}
