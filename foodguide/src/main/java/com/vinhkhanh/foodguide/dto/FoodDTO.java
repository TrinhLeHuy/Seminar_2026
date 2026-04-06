package com.vinhkhanh.foodguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodDTO {

    private Long foodId;
    private String nameVi;
    private String nameEn;
    private Double price;
    private String descriptionVi;
    private String descriptionEn;
    private String imageUrl;
    private Long locationId;
}