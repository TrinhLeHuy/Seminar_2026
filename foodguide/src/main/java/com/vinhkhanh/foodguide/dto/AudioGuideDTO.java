package com.vinhkhanh.foodguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AudioGuideDTO {
    private Long audioId;
    private String audioUrl;
    private String language;
    private Long locationId;
}
