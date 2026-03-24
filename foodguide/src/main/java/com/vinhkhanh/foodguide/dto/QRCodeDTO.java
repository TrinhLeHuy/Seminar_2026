package com.vinhkhanh.foodguide.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QRCodeDTO {

    private Long qrId;
    private String qrValue;
    private Long locationId;

}