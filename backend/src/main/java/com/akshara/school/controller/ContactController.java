package com.akshara.school.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.ContactMessageResponse;
import com.akshara.school.dto.ContactRequest;
import com.akshara.school.service.ContactService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> create(@Valid @RequestBody ContactRequest request) {
        contactService.create(request);
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(Map.of("message", "Your message has been sent."));
    }

    @GetMapping("/admin/contact-messages")
    public List<ContactMessageResponse> list() {
        return contactService.findAll();
    }

    @PostMapping("/admin/contact-messages/{id}/read")
    public ContactMessageResponse markRead(@PathVariable("id") Long id) {
        return contactService.markRead(id);
    }
}