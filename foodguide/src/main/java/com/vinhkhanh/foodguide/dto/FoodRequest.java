package com.vinhkhanh.foodguide.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class FoodRequest {

    private String nameVi;
    private String nameEn;

    private String descriptionVi;
    private String descriptionEn;

    @NotNull
    private Double price;

    private String imageUrl;

    @NotNull
    private Long locationId;
}