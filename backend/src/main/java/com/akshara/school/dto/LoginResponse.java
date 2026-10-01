package com.akshara.school.dto;

public record LoginResponse(
        String token,
        String tokenType,
        long expiresInSeconds,
        UserResponse user) {
}