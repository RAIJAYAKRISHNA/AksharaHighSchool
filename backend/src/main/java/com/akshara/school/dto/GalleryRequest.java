package com.akshara.school.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record GalleryRequest(

        @NotBlank(message = "Please enter a title.") @Size(max = 150, message = "Title must be 150 characters or fewer.") String title,

        @Size(max = 500, message = "Description must be 500 characters or fewer.") String description,

        @NotBlank(message = "Please enter a category.") @Size(max = 50, message = "Category must be 50 characters or fewer.") String category,

        @Size(max = 500, message = "Image link must be 500 characters or fewer.") @Pattern(regexp = "^$|^https?://.+", message = "The image link must start with http:// or https://.") String imageUrl) {
}