package dev.danh.entities.dtos.apps;

import dev.danh.entities.models.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class CustomOAuth2User implements OAuth2User {
    private final OAuth2User delegate;
    private final User user;

    public CustomOAuth2User(OAuth2User delegate, User user) {
        this.delegate = delegate;
        this.user = user;
    }

    @Override
    public Map<String, Object> getAttributes() {
        return delegate.getAttributes();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return delegate.getAuthorities();
    }

    @Override
    public String getName() {
        return delegate.getName();
    }

    public User getUser() {
        return user;
    }

    public String getEmail() {
        return (String) delegate.getAttributes().get("email");
    }

    public String getGoogleId() {
        return (String) delegate.getAttributes().get("sub");
    }

    public String getFullName() {
        return (String) delegate.getAttributes().get("name");
    }

    public String getPicture() {
        return (String) delegate.getAttributes().get("picture");
    }

    public String getFirstName() {
        return (String) delegate.getAttributes().get("given_name");
    }

    public String getLastName() {
        return (String) delegate.getAttributes().get("family_name");
    }

    public Boolean isEmailVerified() {
        Object verified = delegate.getAttributes().get("email_verified");
        return verified instanceof Boolean ? (Boolean) verified : false;
    }
}