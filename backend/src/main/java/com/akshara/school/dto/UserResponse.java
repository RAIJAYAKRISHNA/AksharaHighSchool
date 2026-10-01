package com.akshara.school.dto;

import com.akshara.school.entity.Role;

public record UserResponse(
        Long id,
        String username,
        String fullName,
        Role role,
        boolean mustChangePassword) {
}