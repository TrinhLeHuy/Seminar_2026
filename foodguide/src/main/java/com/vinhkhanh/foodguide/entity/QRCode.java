package com.vinhkhanh.foodguide.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Table(name = "qr_code")
@Data
public class QRCode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qrId;

    @Column(nullable = false, unique = true)
    private String qrValue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "location_id")
    private Location location;

    @OneToMany(mappedBy = "qrCode", cascade = CascadeType.ALL)
    private List<QRScanLog> scanLogs;
}