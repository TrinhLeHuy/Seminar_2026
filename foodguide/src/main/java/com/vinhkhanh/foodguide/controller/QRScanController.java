package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.dto.LocationDetailDTO;
import com.vinhkhanh.foodguide.dto.QRScanLogDTO;
import com.vinhkhanh.foodguide.dto.QRScanRequest;
import com.vinhkhanh.foodguide.entity.QRScanLog;
import com.vinhkhanh.foodguide.service.QRScanLogService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/qr-scan")
@CrossOrigin("*")
public class QRScanController {

    private final QRScanLogService qrScanLogService;

    public QRScanController(QRScanLogService qrScanLogService) {
        this.qrScanLogService = qrScanLogService;
    }

    @PostMapping
    public ResponseEntity<LocationDetailDTO> scanQR(
            @RequestBody QRScanRequest request) {

        return ResponseEntity.ok(
                qrScanLogService.scanQRCode(request));
    }

    @GetMapping("/count/{qrId}")
    public ResponseEntity<Long> getScanCount(
            @PathVariable Long qrId) {

        return ResponseEntity.ok(
                qrScanLogService.getScanCount(qrId));
    }

    @GetMapping("/logs")
    public List<QRScanLogDTO> getLogs() {
        return qrScanLogService.getLogs();
    }
}