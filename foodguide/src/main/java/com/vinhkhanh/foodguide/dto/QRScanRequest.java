package com.vinhkhanh.foodguide.dto;

import lombok.Data;

@Data
public class QRScanRequest {

    private String qrValue;

    private String deviceInfo;

}