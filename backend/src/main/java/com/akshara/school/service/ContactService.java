package com.akshara.school.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.ContactMessageResponse;
import com.akshara.school.dto.ContactRequest;
import com.akshara.school.entity.ContactMessage;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.ContactRepository;
import com.akshara.school.util.TextUtils;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

    @Transactional
    public void create(ContactRequest request) {
        ContactMessage contactMessage = new ContactMessage(
                request.name().trim(),
                request.email().trim(),
                TextUtils.trimToNull(request.phone()),
                request.subject().trim(),
                request.message().trim());

        contactRepository.save(contactMessage);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageResponse> findAll() {
        return contactRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ContactMessageResponse markRead(Long id) {
        ContactMessage contactMessage = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found."));

        contactMessage.setRead(true);
        return toResponse(contactRepository.save(contactMessage));
    }

    private ContactMessageResponse toResponse(ContactMessage contactMessage) {
        return new ContactMessageResponse(
                contactMessage.getId(),
                contactMessage.getName(),
                contactMessage.getEmail(),
                contactMessage.getPhone(),
                contactMessage.getSubject(),
                contactMessage.getMessage(),
                contactMessage.isRead(),
                contactMessage.getCreatedAt());
    }
}