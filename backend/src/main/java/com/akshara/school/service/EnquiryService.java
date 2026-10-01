package com.akshara.school.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.EnquiryRequest;
import com.akshara.school.entity.Enquiry;
import com.akshara.school.repository.EnquiryRepository;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    public EnquiryService(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    @Transactional
    public void create(EnquiryRequest request) {
        String message = request.message() == null || request.message().isBlank()
                ? null
                : request.message().trim();

        Enquiry enquiry = new Enquiry(
                request.studentName().trim(),
                request.dateOfBirth(),
                request.applyingFor(),
                request.parentName().trim(),
                request.phone(),
                request.email().trim(),
                message);

        enquiryRepository.save(enquiry);
    }
}