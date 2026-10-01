package com.akshara.school.service;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.akshara.school.dto.ChangePasswordRequest;
import com.akshara.school.dto.LoginRequest;
import com.akshara.school.dto.LoginResponse;
import com.akshara.school.dto.UserResponse;
import com.akshara.school.entity.AppUser;
import com.akshara.school.exception.ResourceNotFoundException;
import com.akshara.school.repository.AppUserRepository;
import com.akshara.school.security.JwtService;
import com.akshara.school.security.LoginAttemptTracker;

@Service
public class AuthService {

    private static final String INVALID_LOGIN = "Incorrect username or password.";

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final LoginAttemptTracker attemptTracker;
    private final String dummyHash;

    public AuthService(AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            LoginAttemptTracker attemptTracker) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.attemptTracker = attemptTracker;
        this.dummyHash = passwordEncoder.encode(UUID.randomUUID().toString());
    }

    public LoginResponse login(LoginRequest request, String clientAddress) {
        String username = request.username().trim();
        String attemptKey = username.toLowerCase(Locale.ROOT) + "|" + clientAddress;

        if (attemptTracker.isBlocked(attemptKey)) {
            throw new ResponseStatusException(
                    HttpStatus.TOO_MANY_REQUESTS,
                    "Too many failed attempts. Please try again in 15 minutes.");
        }

        Optional<AppUser> found = appUserRepository.findByUsernameIgnoreCase(username);
        String hashToCheck = found.map(AppUser::getPasswordHash).orElse(dummyHash);
        boolean passwordMatches = passwordEncoder.matches(request.password(), hashToCheck);

        if (found.isEmpty() || !passwordMatches) {
            attemptTracker.recordFailure(attemptKey);
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, INVALID_LOGIN);
        }

        AppUser user = found.get();

        if (!user.isEnabled()) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "This account has been deactivated. Please contact the school office.");
        }

        attemptTracker.reset(attemptKey);

        return new LoginResponse(
                jwtService.issueToken(user),
                "Bearer",
                jwtService.getExpirySeconds(),
                toUserResponse(user));
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(Long userId) {
        return appUserRepository.findById(userId)
                .map(this::toUserResponse)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        AppUser user = appUserRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found."));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Your current password is incorrect.");
        }

        if (request.currentPassword().equals(request.newPassword())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Your new password must be different from the current one.");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        user.setMustChangePassword(false);
        appUserRepository.save(user);
    }

    private UserResponse toUserResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getFullName(),
                user.getRole(),
                user.isMustChangePassword());
    }
}