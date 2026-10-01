package com.akshara.school.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record EnquiryRequest(

        @NotBlank(message = "Please enter the student's name.") @Size(min = 2, max = 100, message = "Student name must be 2 to 100 characters.") String studentName,

        @NotNull(message = "Please select the date of birth.") @Past(message = "Date of birth must be in the past.") LocalDate dateOfBirth,

        @NotBlank(message = "Please select the class you are applying for.") @Pattern(regexp = "^(Nursery|LKG|UKG|Class (10|[1-9]))$", message = "Please select a valid class.") String applyingFor,

        @NotBlank(message = "Please enter the parent or guardian's name.") @Size(min = 2, max = 100, message = "Parent name must be 2 to 100 characters.") String parentName,

        @NotBlank(message = "Please enter a valid 10-digit mobile number.") @Pattern(regexp = "^[6-9]\\d{9}$", message = "Please enter a valid 10-digit mobile number.") String phone,

        @NotBlank(message = "Please enter a valid email address.") @Email(message = "Please enter a valid email address.") @Size(max = 150, message = "Email must be 150 characters or fewer.") String email,

        @Size(max = 1000, message = "Message must be 1000 characters or fewer.") String message) {
}