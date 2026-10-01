package com.akshara.school.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record ContactRequest(

        @NotBlank(message = "Please enter your name.") @Size(min = 2, max = 100, message = "Name must be 2 to 100 characters.") String name,

        @NotBlank(message = "Please enter a valid email address.") @Email(message = "Please enter a valid email address.") @Size(max = 150, message = "Email must be 150 characters or fewer.") String email,

        @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Please enter a valid 10-digit mobile number.") String phone,

        @NotBlank(message = "Please enter a subject.") @Size(min = 3, max = 150, message = "Subject must be 3 to 150 characters.") String subject,

        @NotBlank(message = "Please write a message.") @Size(min = 10, max = 1000, message = "Message must be 10 to 1000 characters.") String message) {
}