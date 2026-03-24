package com.vinhkhanh.foodguide.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "qr_scan_log")
@Data
public class QRScanLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long logId;

    private LocalDateTime scanTime;

    private String deviceInfo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qr_id")
    private QRCode qrCode;

    @PrePersist
    public void prePersist() {
        scanTime = LocalDateTime.now();
    }
}