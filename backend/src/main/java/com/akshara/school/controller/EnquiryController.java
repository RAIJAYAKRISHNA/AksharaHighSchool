package com.akshara.school.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.EnquiryRequest;
import com.akshara.school.service.EnquiryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService enquiryService;

    public EnquiryController(EnquiryService enquiryService) {
        this.enquiryService = enquiryService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> create(@Valid @RequestBody EnquiryRequest request) {
        enquiryService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Your enquiry has been received."));
    }
}