package com.akshara.school.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.GalleryRequest;
import com.akshara.school.dto.GalleryResponse;
import com.akshara.school.service.GalleryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class GalleryController {

    private final GalleryService galleryService;

    public GalleryController(GalleryService galleryService) {
        this.galleryService = galleryService;
    }

    @GetMapping("/gallery")
    public List<GalleryResponse> list(
            @RequestParam(name = "category", required = false) String category) {
        return galleryService.findAll(category);
    }

    @PostMapping("/admin/gallery")
    public ResponseEntity<GalleryResponse> create(@Valid @RequestBody GalleryRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(galleryService.create(request));
    }

    @PutMapping("/admin/gallery/{id}")
    public GalleryResponse update(@PathVariable("id") Long id,
            @Valid @RequestBody GalleryRequest request) {
        return galleryService.update(id, request);
    }

    @DeleteMapping("/admin/gallery/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        galleryService.delete(id);
        return ResponseEntity.noContent().build();
    }
}