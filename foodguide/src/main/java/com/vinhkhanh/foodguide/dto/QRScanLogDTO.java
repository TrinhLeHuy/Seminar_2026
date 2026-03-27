package com.vinhkhanh.foodguide.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class QRScanLogDTO {

    private Long logId;
    private String locationName;
    private String qrValue;
    private String deviceInfo;
    private LocalDateTime scanTime;

}