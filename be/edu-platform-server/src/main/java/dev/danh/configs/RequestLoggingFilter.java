package dev.danh.configs;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.stream.Collectors;

@Component
@Slf4j
public class RequestLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Wrap the request to allow reading the body multiple times (if needed)
        // and to cache the body for logging after it's read.
        ContentCachingRequestWrapper wrappedRequest = new ContentCachingRequestWrapper(request);

        long startTime = System.currentTimeMillis();

        try {
            // Proceed with the filter chain (let the request go to the controller)
            filterChain.doFilter(wrappedRequest, response);
        } finally {
            // Log the request details AFTER the request has been processed
            // (This ensures the body has been read and cached)
            long duration = System.currentTimeMillis() - startTime;
            logRequestDetails(wrappedRequest, duration, response.getStatus());
        }
    }

    private void logRequestDetails(ContentCachingRequestWrapper request, long duration, int status) {
        StringBuilder logMessage = new StringBuilder();
        logMessage.append("\n================= INCOMING REQUEST =================\n");
        logMessage.append("Method: ").append(request.getMethod()).append("\n");
        logMessage.append("URI: ").append(request.getRequestURI()).append("\n");
        logMessage.append("Status: ").append(status).append("\n");
        logMessage.append("Duration: ").append(duration).append("ms\n");

        // Log Headers
        logMessage.append("--- Headers ---\n");
        Collections.list(request.getHeaderNames()).forEach(headerName ->
                logMessage.append(headerName).append(": ").append(request.getHeader(headerName)).append("\n")
        );

        // Log Cookies
        logMessage.append("--- Cookies ---\n");
        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                logMessage.append("Name: ").append(cookie.getName())
                        .append(", Value: ").append(cookie.getValue())
                        .append(", Path: ").append(cookie.getPath())
                        .append(", Secure: ").append(cookie.getSecure())
                        .append("\n");
            }
        } else {
            logMessage.append("No Cookies found\n");
        }

        // Log Body
        logMessage.append("--- Body ---\n");
        byte[] content = request.getContentAsByteArray();
        if (content.length > 0) {
            String body = new String(content, StandardCharsets.UTF_8);
            // Limit body log size to avoid flooding console with large files
            if (body.length() > 1000) {
                logMessage.append(body.substring(0, 1000)).append("... (truncated)");
            } else {
                logMessage.append(body);
            }
        } else {
            logMessage.append("[Empty Body]");
        }

        logMessage.append("\n====================================================\n");

        log.info(logMessage.toString());
    }
}
