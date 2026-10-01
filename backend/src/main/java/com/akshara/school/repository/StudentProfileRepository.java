package com.akshara.school.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.StudentProfile;

public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    @EntityGraph(attributePaths = "user")
    Optional<StudentProfile> findByUserId(Long userId);

    @EntityGraph(attributePaths = "user")
    List<StudentProfile> findAllByOrderByUserFullNameAsc();
}