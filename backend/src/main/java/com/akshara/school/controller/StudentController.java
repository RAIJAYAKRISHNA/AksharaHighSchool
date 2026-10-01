package com.akshara.school.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.akshara.school.dto.StudentCredentialsResponse;
import com.akshara.school.dto.StudentRequest;
import com.akshara.school.dto.StudentResponse;
import com.akshara.school.service.StudentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/admin/students")
    public List<StudentResponse> list() {
        return studentService.findAll();
    }

    @PostMapping("/admin/students")
    public ResponseEntity<StudentCredentialsResponse> create(
            @Valid @RequestBody StudentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(studentService.create(request));
    }

    @PutMapping("/admin/students/{id}")
    public StudentResponse update(@PathVariable("id") Long id,
            @Valid @RequestBody StudentRequest request) {
        return studentService.update(id, request);
    }

    @PostMapping("/admin/students/{id}/activate")
    public StudentResponse activate(@PathVariable("id") Long id) {
        return studentService.setEnabled(id, true);
    }

    @PostMapping("/admin/students/{id}/deactivate")
    public StudentResponse deactivate(@PathVariable("id") Long id) {
        return studentService.setEnabled(id, false);
    }

    @PostMapping("/admin/students/{id}/reset-password")
    public StudentCredentialsResponse resetPassword(@PathVariable("id") Long id) {
        return studentService.resetPassword(id);
    }

    @GetMapping("/student/profile")
    public StudentResponse ownProfile(Authentication authentication) {
        return studentService.getOwnProfile(Long.valueOf(authentication.getName()));
    }
}