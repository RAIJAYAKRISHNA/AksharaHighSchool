package com.akshara.school.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.ContactMessage;

public interface ContactRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    long countByReadFalse();
}