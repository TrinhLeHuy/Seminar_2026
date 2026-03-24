package com.vinhkhanh.foodguide.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AudioGuideRequest {
    @NotBlank(message = "Audio URL is required")
    private String audioUrl;

    @NotBlank(message = "Language is required")
    private String language;

    @NotNull(message = "Location ID is required")
    private Long locationId;
}
