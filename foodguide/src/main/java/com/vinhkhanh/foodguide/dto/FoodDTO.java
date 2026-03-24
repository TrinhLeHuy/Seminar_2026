package com.vinhkhanh.foodguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FoodDTO {

    private Long foodId;
    private String name;
    private Double price;
    private String description;
    private String imageUrl;
    private Long locationId;
}