package com.akshara.school.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.GalleryResponse;
import com.akshara.school.entity.GalleryItem;
import com.akshara.school.repository.GalleryRepository;

@Service
public class GalleryService {

    private final GalleryRepository galleryRepository;

    public GalleryService(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @Transactional(readOnly = true)
    public List<GalleryResponse> findAll(String category) {
        boolean allCategories =
                category == null || category.isBlank() || "All".equalsIgnoreCase(category.trim());

        List<GalleryItem> items = allCategories
                ? galleryRepository.findAllByOrderByIdAsc()
                : galleryRepository.findAllByCategoryOrderByIdAsc(category.trim());

        return items.stream().map(this::toResponse).toList();
    }

    private GalleryResponse toResponse(GalleryItem item) {
        return new GalleryResponse(
                item.getId(),
                item.getTitle(),
                item.getDescription(),
                item.getCategory(),
                item.getImageUrl());
    }
}