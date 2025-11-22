package dev.danh.configs;

import dev.danh.entities.dtos.apps.CustomOAuth2User;
import dev.danh.entities.dtos.request.AuthenticationGoogleRequest;
import dev.danh.entities.dtos.response.AuthenticationResponse;
import dev.danh.services.auth.impl.AuthServiceImpl;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
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
    @Value("${URL_FRONTEND}")
    String URL_FRONTEND;
    private final AuthServiceImpl authService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        CustomOAuth2User oAuth2User = (CustomOAuth2User) authentication.getPrincipal();
        String email = oAuth2User.getEmail();

        AuthenticationGoogleRequest authRequest = AuthenticationGoogleRequest.builder()
                .username(email.split("@")[0])
                .email(email)
                .provideId(oAuth2User.getGoogleId())
                .build();

        AuthenticationResponse authResponse = authService.authenticate(authRequest);

        String token = authResponse.getToken();
        String redirectUrl = URL_FRONTEND + "/login?token=" + token;
        log.info("Redirect URL: " + redirectUrl);

        // Chuyển hướng về React app
        getRedirectStrategy().sendRedirect(request, response, redirectUrl);

        clearAuthenticationAttributes(request);
    }

}
