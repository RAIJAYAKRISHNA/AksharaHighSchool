package com.akshara.school.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.GalleryRequest;
import com.akshara.school.dto.GalleryResponse;
import com.akshara.school.entity.GalleryItem;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.GalleryRepository;
import com.akshara.school.util.TextUtils;

@Service
public class GalleryService {

    private final GalleryRepository galleryRepository;

    public GalleryService(GalleryRepository galleryRepository) {
        this.galleryRepository = galleryRepository;
    }

    @Transactional(readOnly = true)
    public List<GalleryResponse> findAll(String category) {
        boolean allCategories = category == null || category.isBlank() || "All".equalsIgnoreCase(category.trim());

        List<GalleryItem> items = allCategories
                ? galleryRepository.findAllByOrderByIdAsc()
                : galleryRepository.findAllByCategoryOrderByIdAsc(category.trim());

        return items.stream().map(this::toResponse).toList();
    }

    @Transactional
    public GalleryResponse create(GalleryRequest request) {
        GalleryItem item = new GalleryItem(
                request.title().trim(),
                TextUtils.trimToNull(request.description()),
                request.category().trim(),
                TextUtils.trimToNull(request.imageUrl()));

        return toResponse(galleryRepository.save(item));
    }

    @Transactional
    public GalleryResponse update(Long id, GalleryRequest request) {
        GalleryItem item = galleryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item not found."));

        item.setTitle(request.title().trim());
        item.setDescription(TextUtils.trimToNull(request.description()));
        item.setCategory(request.category().trim());
        item.setImageUrl(TextUtils.trimToNull(request.imageUrl()));

        return toResponse(galleryRepository.save(item));
    }

    @Transactional
    public void delete(Long id) {
        if (!galleryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Gallery item not found.");
        }
        galleryRepository.deleteById(id);
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