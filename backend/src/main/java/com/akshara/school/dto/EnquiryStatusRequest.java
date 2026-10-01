package com.akshara.school.dto;

import com.akshara.school.entity.EnquiryStatus;

import jakarta.validation.constraints.NotNull;

public record EnquiryStatusRequest(

        @NotNull(message = "Please choose a status.") EnquiryStatus status) {
}