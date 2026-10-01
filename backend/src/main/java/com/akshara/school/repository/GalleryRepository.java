package com.akshara.school.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.GalleryItem;

public interface GalleryRepository extends JpaRepository<GalleryItem, Long> {

    List<GalleryItem> findAllByOrderByIdAsc();

    List<GalleryItem> findAllByCategoryOrderByIdAsc(String category);
}