package com.akshara.school.dto;

import java.time.Instant;

public record StudentResponse(
        Long id,
        String admissionNumber,
        String fullName,
        String className,
        String section,
        String guardianName,
        String guardianPhone,
        boolean enabled,
        boolean mustChangePassword,
        Instant createdAt) {
}