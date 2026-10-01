package com.akshara.school.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.EnquiryRequest;
import com.akshara.school.dto.EnquiryResponse;
import com.akshara.school.entity.Enquiry;
import com.akshara.school.entity.EnquiryStatus;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.EnquiryRepository;
import com.akshara.school.util.TextUtils;

@Service
public class EnquiryService {

    private final EnquiryRepository enquiryRepository;

    public EnquiryService(EnquiryRepository enquiryRepository) {
        this.enquiryRepository = enquiryRepository;
    }

    @Transactional
    public void create(EnquiryRequest request) {
        Enquiry enquiry = new Enquiry(
                request.studentName().trim(),
                request.dateOfBirth(),
                request.applyingFor(),
                request.parentName().trim(),
                request.phone(),
                request.email().trim(),
                TextUtils.trimToNull(request.message()));

        enquiryRepository.save(enquiry);
    }

    @Transactional(readOnly = true)
    public List<EnquiryResponse> findAll() {
        return enquiryRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EnquiryResponse updateStatus(Long id, EnquiryStatus status) {
        Enquiry enquiry = enquiryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Enquiry not found."));

        enquiry.setStatus(status);
        return toResponse(enquiryRepository.save(enquiry));
    }

    private EnquiryResponse toResponse(Enquiry enquiry) {
        return new EnquiryResponse(
                enquiry.getId(),
                enquiry.getStudentName(),
                enquiry.getDateOfBirth(),
                enquiry.getApplyingFor(),
                enquiry.getParentName(),
                enquiry.getPhone(),
                enquiry.getEmail(),
                enquiry.getMessage(),
                enquiry.getStatus(),
                enquiry.getCreatedAt());
    }
}