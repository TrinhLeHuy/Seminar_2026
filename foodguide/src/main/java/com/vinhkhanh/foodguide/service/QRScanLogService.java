package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.dto.LocationDetailDTO;
import com.vinhkhanh.foodguide.dto.QRScanRequest;
import com.vinhkhanh.foodguide.entity.QRCode;
import com.vinhkhanh.foodguide.entity.QRScanLog;
import com.vinhkhanh.foodguide.repository.QRCodeRepository;
import com.vinhkhanh.foodguide.repository.QRScanLogRepository;
import org.springframework.stereotype.Service;

@Service
public class QRScanLogService {

    private final QRCodeRepository qrCodeRepository;
    private final QRScanLogRepository qrScanLogRepository;
    private final LocationService locationService;

    public QRScanLogService(QRCodeRepository qrCodeRepository,
                            QRScanLogRepository qrScanLogRepository,
                            LocationService locationService) {
        this.qrCodeRepository = qrCodeRepository;
        this.qrScanLogRepository = qrScanLogRepository;
        this.locationService = locationService;
    }

    public LocationDetailDTO scanQRCode(QRScanRequest request) {

        QRCode qrCode = qrCodeRepository
                .findByQrValue(request.getQrValue())
                .orElseThrow(() -> new RuntimeException("QR Code not found"));

        QRScanLog log = new QRScanLog();
        log.setQrCode(qrCode);
        log.setDeviceInfo(request.getDeviceInfo());

        qrScanLogRepository.save(log);

        return locationService.getLocationById(
                qrCode.getLocation().getLocationId()
        );
    }

    public Long getScanCount(Long qrId) {

        return qrScanLogRepository.countByQrCodeQrId(qrId);

    }
}