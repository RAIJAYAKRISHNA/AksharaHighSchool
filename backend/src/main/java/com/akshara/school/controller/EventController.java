package com.akshara.school.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.EventRequest;
import com.akshara.school.dto.EventResponse;
import com.akshara.school.service.EventService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @GetMapping("/events")
    public List<EventResponse> list() {
        return eventService.findAll();
    }

    @PostMapping("/admin/events")
    public ResponseEntity<EventResponse> create(@Valid @RequestBody EventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(eventService.create(request));
    }

    @PutMapping("/admin/events/{id}")
    public EventResponse update(@PathVariable("id") Long id,
            @Valid @RequestBody EventRequest request) {
        return eventService.update(id, request);
    }

    @DeleteMapping("/admin/events/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}