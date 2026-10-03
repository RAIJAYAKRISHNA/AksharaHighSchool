package com.akshara.school;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

class AuthSecurityTest extends IntegrationTestSupport {

    @Test
    void adminCanLogIn() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(ADMIN_USERNAME, ADMIN_PASSWORD)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    void wrongPasswordAndUnknownUserGetTheSameAnswer() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(ADMIN_USERNAME, "wrong-password")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Incorrect username or password."));

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(unique("nobody"), "whatever123")))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Incorrect username or password."));
    }

    @Test
    void protectedEndpointsNeedAToken() throws Exception {
        for (String path : new String[] { "/api/auth/me", "/api/admin/summary", "/api/student/profile" }) {
            mockMvc.perform(get(path))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Please sign in to continue."));
        }
    }

    @Test
    void publicEndpointsWorkWithoutAToken() throws Exception {
        mockMvc.perform(get("/api/events")).andExpect(status().isOk());
        mockMvc.perform(get("/api/gallery")).andExpect(status().isOk());
        mockMvc.perform(get("/actuator/health")).andExpect(status().isOk());
    }

    @Test
    void tamperedTokenIsRejected() throws Exception {
        String token = login(ADMIN_USERNAME, ADMIN_PASSWORD);

        mockMvc.perform(get("/api/auth/me").header("Authorization", bearer(token + "x")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rolesAreEnforcedBothWays() throws Exception {
        CreatedStudent student = createStudent();
        String studentAuth = bearer(login(student.admissionNumber(), student.temporaryPassword()));

        mockMvc.perform(get("/api/student/profile").header("Authorization", studentAuth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.admissionNumber").value(student.admissionNumber()));

        mockMvc.perform(get("/api/admin/summary").header("Authorization", studentAuth))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/student/profile").header("Authorization", adminAuth()))
                .andExpect(status().isForbidden());
    }

    @Test
    void deactivatedStudentIsLockedOutImmediately() throws Exception {
        CreatedStudent student = createStudent();
        String studentAuth = bearer(login(student.admissionNumber(), student.temporaryPassword()));

        mockMvc.perform(post("/api/admin/students/" + student.id() + "/deactivate")
                .header("Authorization", adminAuth()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/student/profile").header("Authorization", studentAuth))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(student.admissionNumber(), student.temporaryPassword())))
                .andExpect(status().isForbidden());
    }

    @Test
    void repeatedWrongPasswordsAreThrottled() throws Exception {
        String username = unique("throttle");

        for (int attempt = 1; attempt <= 5; attempt++) {
            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(loginJson(username, "wrong-password-" + attempt)))
                    .andExpect(status().isUnauthorized());
        }

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(username, "wrong-password-6")))
                .andExpect(status().isTooManyRequests());
    }

    @Test
    void changingPasswordWorksAndRejectsWrongCurrentPassword() throws Exception {
        CreatedStudent student = createStudent();
        String studentAuth = bearer(login(student.admissionNumber(), student.temporaryPassword()));

        mockMvc.perform(post("/api/auth/change-password")
                .header("Authorization", studentAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"not-the-password\",\"newPassword\":\"Newpass123\"}"))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/auth/change-password")
                .header("Authorization", studentAuth)
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"%s\",\"newPassword\":\"Newpass123\"}"
                        .formatted(student.temporaryPassword())))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(student.admissionNumber(), student.temporaryPassword())))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(student.admissionNumber(), "Newpass123")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.mustChangePassword").value(false));
    }

    @Test
    void weakNewPasswordIsRejected() throws Exception {
        mockMvc.perform(post("/api/auth/change-password")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"currentPassword\":\"%s\",\"newPassword\":\"short\"}"
                        .formatted(ADMIN_PASSWORD)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.newPassword").exists());
    }
}