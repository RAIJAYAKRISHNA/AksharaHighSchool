package com.akshara.school.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.AdminSummaryResponse;
import com.akshara.school.entity.EnquiryStatus;
import com.akshara.school.entity.Role;
import com.akshara.school.repository.AppUserRepository;
import com.akshara.school.repository.ContactRepository;
import com.akshara.school.repository.EnquiryRepository;
import com.akshara.school.repository.EventRepository;
import com.akshara.school.repository.GalleryRepository;

@Service
public class AdminService {

    private final EnquiryRepository enquiryRepository;
    private final ContactRepository contactRepository;
    private final AppUserRepository appUserRepository;
    private final EventRepository eventRepository;
    private final GalleryRepository galleryRepository;

    public AdminService(EnquiryRepository enquiryRepository,
            ContactRepository contactRepository,
            AppUserRepository appUserRepository,
            EventRepository eventRepository,
            GalleryRepository galleryRepository) {
        this.enquiryRepository = enquiryRepository;
        this.contactRepository = contactRepository;
        this.appUserRepository = appUserRepository;
        this.eventRepository = eventRepository;
        this.galleryRepository = galleryRepository;
    }

    @Transactional(readOnly = true)
    public AdminSummaryResponse getSummary() {
        return new AdminSummaryResponse(
                enquiryRepository.countByStatus(EnquiryStatus.NEW),
                contactRepository.countByReadFalse(),
                appUserRepository.countByRole(Role.STUDENT),
                eventRepository.count(),
                galleryRepository.count());
    }
}