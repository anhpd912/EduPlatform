package dev.danh.entities.dtos.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class APIResponse {
    String message;
    Object data;
    int statusCode;

    public APIResponse(String message, Object data) {
        this.message = message;
        this.data = data;
        this.statusCode = 200;
    }

    public APIResponse(String message, int statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}
