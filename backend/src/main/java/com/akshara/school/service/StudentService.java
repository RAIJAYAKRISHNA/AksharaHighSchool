package com.akshara.school.service;

import java.security.SecureRandom;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.akshara.school.dto.StudentCredentialsResponse;
import com.akshara.school.dto.StudentRequest;
import com.akshara.school.dto.StudentResponse;
import com.akshara.school.entity.AppUser;
import com.akshara.school.entity.Role;
import com.akshara.school.entity.StudentProfile;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.AppUserRepository;
import com.akshara.school.repository.StudentProfileRepository;
import com.akshara.school.util.TextUtils;

@Service
public class StudentService {

    private static final String PASSWORD_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
    private static final int PASSWORD_LENGTH = 12;
    private static final String DUPLICATE_MESSAGE = "A student with this admission number already exists.";

    private final SecureRandom secureRandom = new SecureRandom();

    private final AppUserRepository appUserRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(AppUserRepository appUserRepository,
            StudentProfileRepository studentProfileRepository,
            PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> findAll() {
        return studentProfileRepository.findAllByOrderByUserFullNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public StudentResponse getOwnProfile(Long userId) {
        return toResponse(findProfile(userId));
    }

    @Transactional
    public StudentCredentialsResponse create(StudentRequest request) {
        String admissionNumber = request.admissionNumber().trim();

        if (appUserRepository.existsByUsernameIgnoreCase(admissionNumber)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, DUPLICATE_MESSAGE);
        }

        String temporaryPassword = generateTemporaryPassword();

        AppUser user = new AppUser(
                admissionNumber,
                passwordEncoder.encode(temporaryPassword),
                request.fullName().trim(),
                Role.STUDENT,
                true);
        appUserRepository.save(user);

        StudentProfile profile = new StudentProfile(
                user,
                request.className(),
                TextUtils.trimToNull(request.section()),
                TextUtils.trimToNull(request.guardianName()),
                TextUtils.trimToNull(request.guardianPhone()));
        studentProfileRepository.save(profile);

        return new StudentCredentialsResponse(toResponse(profile), temporaryPassword);
    }

    @Transactional
    public StudentResponse update(Long userId, StudentRequest request) {
        StudentProfile profile = findProfile(userId);
        AppUser user = profile.getUser();
        String admissionNumber = request.admissionNumber().trim();

        if (appUserRepository.existsByUsernameIgnoreCaseAndIdNot(admissionNumber, userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, DUPLICATE_MESSAGE);
        }

        user.setUsername(admissionNumber);
        user.setFullName(request.fullName().trim());
        profile.setClassName(request.className());
        profile.setSection(TextUtils.trimToNull(request.section()));
        profile.setGuardianName(TextUtils.trimToNull(request.guardianName()));
        profile.setGuardianPhone(TextUtils.trimToNull(request.guardianPhone()));

        return toResponse(profile);
    }

    @Transactional
    public StudentResponse setEnabled(Long userId, boolean enabled) {
        StudentProfile profile = findProfile(userId);
        profile.getUser().setEnabled(enabled);
        return toResponse(profile);
    }

    @Transactional
    public StudentCredentialsResponse resetPassword(Long userId) {
        StudentProfile profile = findProfile(userId);
        String temporaryPassword = generateTemporaryPassword();

        AppUser user = profile.getUser();
        user.setPasswordHash(passwordEncoder.encode(temporaryPassword));
        user.setMustChangePassword(true);

        return new StudentCredentialsResponse(toResponse(profile), temporaryPassword);
    }

    private StudentProfile findProfile(Long userId) {
        return studentProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found."));
    }

    private String generateTemporaryPassword() {
        StringBuilder password = new StringBuilder(PASSWORD_LENGTH);
        for (int i = 0; i < PASSWORD_LENGTH; i++) {
            password.append(PASSWORD_ALPHABET.charAt(secureRandom.nextInt(PASSWORD_ALPHABET.length())));
        }
        return password.toString();
    }

    private StudentResponse toResponse(StudentProfile profile) {
        AppUser user = profile.getUser();
        return new StudentResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                profile.getClassName(),
                profile.getSection(),
                profile.getGuardianName(),
                profile.getGuardianPhone(),
                user.isEnabled(),
                user.isMustChangePassword(),
                user.getCreatedAt());
    }
}