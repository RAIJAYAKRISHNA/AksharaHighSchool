package com.akshara.school.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record EventRequest(

        @NotBlank(message = "Please enter the event title.") @Size(max = 150, message = "Title must be 150 characters or fewer.") String title,

        @NotBlank(message = "Please enter a description.") @Size(max = 1000, message = "Description must be 1000 characters or fewer.") String description,

        LocalDate eventDate,

        @Size(max = 150, message = "Location must be 150 characters or fewer.") String location) {
}