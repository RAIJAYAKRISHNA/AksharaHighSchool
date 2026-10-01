package com.akshara.school.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.ContactRequest;
import com.akshara.school.entity.ContactMessage;
import com.akshara.school.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public void create(ContactRequest request) {
        String phone = request.phone() == null || request.phone().isBlank()
                ? null
                : request.phone().trim();

        ContactMessage contactMessage = new ContactMessage(
                request.name().trim(),
                request.email().trim(),
                phone,
                request.subject().trim(),
                request.message().trim());

        contactRepository.save(contactMessage);
    }
}