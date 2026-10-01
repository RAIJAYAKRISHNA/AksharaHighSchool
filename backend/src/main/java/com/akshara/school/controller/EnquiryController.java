package com.akshara.school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.EnquiryRequest;
import com.akshara.school.dto.EnquiryResponse;
import com.akshara.school.dto.EnquiryStatusRequest;
import com.akshara.school.service.EnquiryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping("/enquiries")
    public ResponseEntity<Map<String, String>> create(@Valid @RequestBody EnquiryRequest request) {
        enquiryService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Your enquiry has been received."));
    }

    @GetMapping("/admin/enquiries")
    public List<EnquiryResponse> list() {
        return enquiryService.findAll();
    }

    @PatchMapping("/admin/enquiries/{id}/status")
    public EnquiryResponse updateStatus(@PathVariable("id") Long id,
            @Valid @RequestBody EnquiryStatusRequest request) {
        return enquiryService.updateStatus(id, request.status());
    }
}