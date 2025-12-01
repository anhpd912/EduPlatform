package dev.danh.services.auth;

import dev.danh.entities.dtos.request.*;
import dev.danh.entities.dtos.response.AuthenticationResponse;
import dev.danh.entities.dtos.response.IntrospectResponse;
import jakarta.mail.MessagingException;

import java.text.ParseException;

public interface AuthService {
    AuthenticationResponse authenticate(AuthenticationRequest request);
    IntrospectResponse introspect(IntrospectRequest request);
    void logout(LogoutRequest token);
    AuthenticationResponse refreshToken(String request) throws ParseException;

    AuthenticationResponse authenticate(AuthenticationGoogleRequest request);

    Boolean resetPassword(String email) throws MessagingException;

    Boolean updatePassword(String token, String newPassword);

    Boolean logOutDevice(LogOutDeviceRequest request);
}
