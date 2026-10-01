package com.akshara.school.dto;

public record GalleryResponse(
        Long id,
        String title,
        String description,
        String category,
        String imageUrl) {
}