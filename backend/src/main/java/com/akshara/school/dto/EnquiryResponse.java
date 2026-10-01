package com.akshara.school.dto;

import java.time.Instant;
import java.time.LocalDate;

import com.akshara.school.entity.EnquiryStatus;

public record EnquiryResponse(
        Long id,
        String studentName,
        LocalDate dateOfBirth,
        String applyingFor,
        String parentName,
        String phone,
        String email,
        String message,
        EnquiryStatus status,
        Instant createdAt) {
}