package com.akshara.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record LoginRequest(

        @NotBlank(message = "Please enter your username.") @Size(max = 100, message = "Username is too long.") String username,

        @NotBlank(message = "Please enter your password.") @Size(max = 128, message = "Password is too long.") String password) {
}