package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.dto.QRCodeDTO;
import com.vinhkhanh.foodguide.dto.QRCodeRequest;
import com.vinhkhanh.foodguide.service.QRCodeService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qr-codes")
@CrossOrigin("*")
public class QRCodeController {

    private final QRCodeService qrCodeService;

    public QRCodeController(QRCodeService qrCodeService) {
        this.qrCodeService = qrCodeService;
    }

    @GetMapping
    public ResponseEntity<List<QRCodeDTO>> getAll() {
        return ResponseEntity.ok(qrCodeService.getAllQRCodes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<QRCodeDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(qrCodeService.getQRCodeById(id));
    }

    @PostMapping
    public ResponseEntity<QRCodeDTO> create(
            @Valid @RequestBody QRCodeRequest request) {

        return ResponseEntity.ok(
                qrCodeService.createQRCode(request)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<QRCodeDTO> update(
            @PathVariable Long id,
            @Valid @RequestBody QRCodeRequest request) {

        return ResponseEntity.ok(
                qrCodeService.updateQRCode(id, request)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {

        qrCodeService.deleteQRCode(id);

        return ResponseEntity.noContent().build();
    }
}