package com.akshara.school;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import com.jayway.jsonpath.JsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
abstract class IntegrationTestSupport {

    static final String ADMIN_USERNAME = "admin@test.local";
    static final String ADMIN_PASSWORD = "TestAdminPass123";

    record CreatedStudent(long id, String admissionNumber, String temporaryPassword) {
    }

    @Autowired
    protected MockMvc mockMvc;

    @Value("${spring.datasource.url}")
    private String datasourceUrl;

    @BeforeEach
    void ensureInMemoryDatabase() {
        assertThat(datasourceUrl)
                .as("Tests must only run against the in-memory test database")
                .startsWith("jdbc:h2:mem:");
    }

    protected static String loginJson(String username, String password) {
        return "{\"username\":\"%s\",\"password\":\"%s\"}".formatted(username, password);
    }

    protected String login(String username, String password) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(loginJson(username, password)))
                .andExpect(status().isOk())
                .andReturn();
        return JsonPath.read(result.getResponse().getContentAsString(), "$.token");
    }

    protected String bearer(String token) {
        return "Bearer " + token;
    }

    protected String adminAuth() throws Exception {
        return bearer(login(ADMIN_USERNAME, ADMIN_PASSWORD));
    }

    protected String unique(String prefix) {
        return prefix + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

    protected CreatedStudent createStudent() throws Exception {
        String admissionNumber = unique("T");
        String body = """
                {"admissionNumber":"%s","fullName":"Test Student","className":"Class 5",
                 "section":"A","guardianName":"Test Parent","guardianPhone":"9876543210"}
                """.formatted(admissionNumber);

        MvcResult result = mockMvc.perform(post("/api/admin/students")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
                .andExpect(status().isCreated())
                .andReturn();

        String response = result.getResponse().getContentAsString();
        long id = ((Number) JsonPath.read(response, "$.student.id")).longValue();
        String temporaryPassword = JsonPath.read(response, "$.temporaryPassword");
        return new CreatedStudent(id, admissionNumber, temporaryPassword);
    }
}