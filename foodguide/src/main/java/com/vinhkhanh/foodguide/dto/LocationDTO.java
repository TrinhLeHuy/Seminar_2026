package com.vinhkhanh.foodguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LocationDTO {
    private Long locationId;
    private String name;
    private String description;
    private Double latitude;
    private Double longitude;
    private String imageUrl;
    private Long userId;
    private List<FoodDTO> foods;
    private List<AudioGuideDTO> audioGuides;
    private QRCodeDTO qrCode;
}
