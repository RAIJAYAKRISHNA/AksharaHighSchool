package com.akshara.school.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.Enquiry;
import com.akshara.school.entity.EnquiryStatus;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findAllByOrderByCreatedAtDesc();

    long countByStatus(EnquiryStatus status);
}