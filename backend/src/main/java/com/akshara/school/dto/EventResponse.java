package com.akshara.school.dto;

import java.time.LocalDate;

public record EventResponse(
        Long id,
        String title,
        String description,
        LocalDate eventDate,
        String location) {
}