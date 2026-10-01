package com.akshara.school.dto;

public record AdminSummaryResponse(
        long newEnquiries,
        long unreadMessages,
        long students,
        long events,
        long galleryItems) {
}