package com.akshara.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record StudentRequest(

        @NotBlank(message = "Please enter the admission number.") @Size(min = 3, max = 30, message = "Admission number must be 3 to 30 characters.") @Pattern(regexp = "^[A-Za-z0-9/-]+$", message = "Use only letters, numbers, / and - in the admission number.") String admissionNumber,

        @NotBlank(message = "Please enter the student's name.") @Size(min = 2, max = 100, message = "Name must be 2 to 100 characters.") String fullName,

        @NotBlank(message = "Please select the class.") @Pattern(regexp = "^(Nursery|LKG|UKG|Class (10|[1-9]))$", message = "Please select a valid class.") String className,

        @Size(max = 10, message = "Section must be 10 characters or fewer.") String section,

        @Size(max = 100, message = "Guardian name must be 100 characters or fewer.") String guardianName,

        @Pattern(regexp = "^$|^[6-9]\\d{9}$", message = "Please enter a valid 10-digit mobile number.") String guardianPhone) {
}