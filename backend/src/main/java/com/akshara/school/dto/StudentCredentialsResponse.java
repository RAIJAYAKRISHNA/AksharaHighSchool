package com.akshara.school.dto;

public record StudentCredentialsResponse(
        StudentResponse student,
        String temporaryPassword) {
}   