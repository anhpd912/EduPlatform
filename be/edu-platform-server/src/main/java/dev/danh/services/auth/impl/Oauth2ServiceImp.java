package dev.danh.services.auth.impl;


import dev.danh.entities.dtos.apps.CustomOAuth2User;
import dev.danh.entities.models.User;
import dev.danh.enums.AuthProvider;
import dev.danh.repositories.user.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class Oauth2ServiceImp extends DefaultOAuth2UserService {
    UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        return processOAuth2User(userRequest, oAuth2User);

    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String avatarUrl = oAuth2User.getAttribute("picture");
        String providerId = oAuth2User.getAttribute("sub");
        String gender = oAuth2User.getAttribute("gender");
        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found in OAuth2 user attributes");
        }
        User user = userRepository.findByEmail(email)
                .map(existingUser -> {
                    // Update existing user details if necessary
                    existingUser.setFullName(name);
                    existingUser.setAvatarUrl(avatarUrl);
                    existingUser.setAuthProvider(AuthProvider.GOOGLE); // Assuming Google as the provider
                    existingUser.setProviderId(providerId);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> createUser(email, name, avatarUrl, providerId));
        return new CustomOAuth2User(oAuth2User, user);

    }
    private User createUser(String email, String name, String avatarUrl, String providerId) {
        User user = new User();
        user.setEmail(email);
        user.setFullName(name);
        user.setAvatarUrl(avatarUrl);
        user.setAuthProvider(AuthProvider.GOOGLE); // Assuming Google as the provider
        user.setProviderId(providerId);
        user.setUsername(email.split("@")[0]); // Set username as the part before '@' in email
        user.setIsActive(true); // Set the user as active by default
        // Set other fields as necessary, e.g., password, roles, etc.
        return userRepository.save(user);
    }

}
