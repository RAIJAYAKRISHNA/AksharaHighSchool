package com.akshara.school.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.akshara.school.dto.EventRequest;
import com.akshara.school.dto.EventResponse;
import com.akshara.school.entity.Event;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.EventRepository;
import com.akshara.school.util.TextUtils;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    @Transactional(readOnly = true)
    public List<EventResponse> findAll() {
        return eventRepository.findAllByOrderByEventDateAscIdAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public EventResponse create(EventRequest request) {
        Event event = new Event(
                request.title().trim(),
                request.description().trim(),
                request.eventDate(),
                TextUtils.trimToNull(request.location()));

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public EventResponse update(Long id, EventRequest request) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found."));

        event.setTitle(request.title().trim());
        event.setDescription(request.description().trim());
        event.setEventDate(request.eventDate());
        event.setLocation(TextUtils.trimToNull(request.location()));

        return toResponse(eventRepository.save(event));
    }

    @Transactional
    public void delete(Long id) {
        if (!eventRepository.existsById(id)) {
            throw new ResourceNotFoundException("Event not found.");
        }
        eventRepository.deleteById(id);
    }

    private EventResponse toResponse(Event event) {
        return new EventResponse(
                event.getId(),
                event.getTitle(),
                event.getDescription(),
                event.getEventDate(),
                event.getLocation());
    }
}