package com.vinhkhanh.foodguide.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QRCodeRequest {

    @NotBlank
    private String qrValue;

    @NotNull
    private Long locationId;

}