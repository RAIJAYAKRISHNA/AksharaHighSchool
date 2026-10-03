package com.akshara.school;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import com.jayway.jsonpath.JsonPath;

class ApiTest extends IntegrationTestSupport {

    private static String enquiryJson(String studentName) {
        return """
                {"studentName":"%s","dateOfBirth":"2020-01-10","applyingFor":"LKG",
                 "parentName":"Test Parent","phone":"9876543210","email":"parent@example.com","message":""}
                """.formatted(studentName);
    }

    @Test
    void enquiryIsSavedAndVisibleToAdmin() throws Exception {
        String studentName = unique("Child");

        mockMvc.perform(post("/api/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content(enquiryJson(studentName)))
                .andExpect(status().isCreated());

        String body = mockMvc.perform(get("/api/admin/enquiries").header("Authorization", adminAuth()))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        List<Integer> ids = JsonPath.read(body, "$[?(@.studentName=='%s')].id".formatted(studentName));
        assertThat(ids).hasSize(1);

        mockMvc.perform(patch("/api/admin/enquiries/" + ids.get(0) + "/status")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"status\":\"CONTACTED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONTACTED"));
    }

    @Test
    void invalidEnquiryReturnsFieldErrors() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"studentName":"A","dateOfBirth":"2999-01-01","applyingFor":"Class 11",
                         "parentName":"","phone":"12345","email":"abc"}
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.errors.studentName").exists())
                .andExpect(jsonPath("$.errors.dateOfBirth").exists())
                .andExpect(jsonPath("$.errors.applyingFor").exists())
                .andExpect(jsonPath("$.errors.parentName").exists())
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors.email").exists());
    }

    @Test
    void malformedJsonReturnsBadRequest() throws Exception {
        mockMvc.perform(post("/api/enquiries")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{not json"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").exists());
    }

    @Test
    void contactMessageValidationAndStorage() throws Exception {
        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"name":"Test Parent","email":"parent@example.com","phone":"",
                         "subject":"Visit request","message":"I would like to visit the school."}
                        """))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/contact")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"\",\"email\":\"x\",\"subject\":\"\",\"message\":\"short\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.message").exists());
    }

    @Test
    void studentCreationReturnsOneTimePasswordAndRejectsDuplicates() throws Exception {
        CreatedStudent student = createStudent();
        assertThat(student.temporaryPassword()).hasSize(12);

        mockMvc.perform(post("/api/admin/students")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"admissionNumber":"%s","fullName":"Another Student","className":"UKG"}
                        """.formatted(student.admissionNumber())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("A student with this admission number already exists."));

        mockMvc.perform(get("/api/admin/students").header("Authorization", adminAuth()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].temporaryPassword").doesNotExist());
    }

    @Test
    void eventLifecycleAsAdmin() throws Exception {
        String title = unique("Event");

        String created = mockMvc.perform(post("/api/admin/events")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {"title":"%s","description":"A test event.","eventDate":"2030-05-01","location":"Hall"}
                        """.formatted(title)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.eventDate").value("2030-05-01"))
                .andReturn().getResponse().getContentAsString();

        long id = ((Number) JsonPath.read(created, "$.id")).longValue();

        String publicList = mockMvc.perform(get("/api/events"))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();
        assertThat(publicList).contains(title);

        mockMvc.perform(put("/api/admin/events/" + id)
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"%s edited\",\"description\":\"Edited.\",\"eventDate\":null,\"location\":\"\"}"
                        .formatted(title)))
                .andExpect(status().isOk());

        mockMvc.perform(delete("/api/admin/events/" + id).header("Authorization", adminAuth()))
                .andExpect(status().isNoContent());

        mockMvc.perform(delete("/api/admin/events/" + id).header("Authorization", adminAuth()))
                .andExpect(status().isNotFound());
    }

    @Test
    void galleryFilteringAndUnsafeLinksAreHandled() throws Exception {
        String category = unique("Cat");

        mockMvc.perform(post("/api/admin/gallery")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Photo\",\"category\":\"%s\",\"imageUrl\":\"\"}".formatted(category)))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/gallery").param("category", category))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        mockMvc.perform(post("/api/admin/gallery")
                .header("Authorization", adminAuth())
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"title\":\"Bad\",\"category\":\"%s\",\"imageUrl\":\"javascript:alert(1)\"}"
                        .formatted(category)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.imageUrl").exists());
    }

    @Test
    void unknownUrlReturnsJsonNotAnHtmlErrorPage() throws Exception {
        mockMvc.perform(get("/api/does-not-exist").header("Authorization", adminAuth()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").exists());
    }
}