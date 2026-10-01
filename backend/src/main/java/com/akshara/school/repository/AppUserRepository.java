package com.akshara.school.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.akshara.school.entity.AppUser;
import com.akshara.school.entity.Role;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCase(String username);

    boolean existsByUsernameIgnoreCaseAndIdNot(String username, Long id);

    long countByRole(Role role);
}