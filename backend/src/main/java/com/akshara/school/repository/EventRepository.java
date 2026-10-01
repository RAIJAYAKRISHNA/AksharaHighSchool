package com.akshara.school.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.Event;

public interface EventRepository extends JpaRepository<Event, Long> {

    // Dated events come first, oldest to newest; events with no date yet come last.
    List<Event> findAllByOrderByEventDateAscIdAsc();
}