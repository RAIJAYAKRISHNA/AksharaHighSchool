package com.akshara.school.config;

import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.akshara.school.entity.AppUser;
import com.akshara.school.entity.Role;
import com.akshara.school.repository.AppUserRepository;

@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final String adminEmail;
    private final String adminPassword;

    public AdminSeeder(AppUserRepository appUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email}") String adminEmail,
            @Value("${app.admin.password}") String adminPassword) {
        this.appUserRepository = appUserRepository;
        this.passwordEncoder = passwordEncoder;
        this.adminEmail = adminEmail;
        this.adminPassword = adminPassword;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (adminEmail.isBlank() || adminPassword.isBlank()) {
            log.info("ADMIN_EMAIL or ADMIN_PASSWORD is not set; skipping admin account creation.");
            return;
        }

        String email = adminEmail.trim().toLowerCase(Locale.ROOT);

        if (!email.contains("@")) {
            throw new IllegalStateException("ADMIN_EMAIL must be a valid email address.");
        }

        if (adminPassword.length() < 10) {
            throw new IllegalStateException("ADMIN_PASSWORD must be at least 10 characters long.");
        }

        if (appUserRepository.existsByUsernameIgnoreCase(email)) {
            return;
        }

        AppUser admin = new AppUser(
                email,
                passwordEncoder.encode(adminPassword),
                "School Administrator",
                Role.ADMIN,
                false);

        appUserRepository.save(admin);
        log.info("Created the initial admin account for {}", email);
    }
}