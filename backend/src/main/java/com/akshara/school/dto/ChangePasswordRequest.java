package com.akshara.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ChangePasswordRequest(

        @NotBlank(message = "Please enter your current password.") String currentPassword,

        @NotBlank(message = "Please enter a new password.") @Size(min = 8, max = 64, message = "Password must be 8 to 64 characters.") @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "Password must include at least one letter and one number.") String newPassword) {
}