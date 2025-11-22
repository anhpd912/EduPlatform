package dev.danh.services.auth;

import dev.danh.entities.dtos.request.*;
import dev.danh.entities.dtos.response.AuthenticationResponse;
import dev.danh.entities.dtos.response.IntrospectResponse;

public interface AuthService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
    void logout(LogoutRequest token);
    AuthenticationResponse refreshToken(RefreshRequest request);

    AuthenticationResponse authenticate(AuthenticationGoogleRequest request);
}
