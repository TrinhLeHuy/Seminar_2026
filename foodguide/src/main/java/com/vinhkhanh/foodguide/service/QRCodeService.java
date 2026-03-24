package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.dto.QRCodeDTO;
import com.vinhkhanh.foodguide.dto.QRCodeRequest;
import com.vinhkhanh.foodguide.entity.Location;
import com.vinhkhanh.foodguide.entity.QRCode;
import com.vinhkhanh.foodguide.repository.LocationRepository;
import com.vinhkhanh.foodguide.repository.QRCodeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QRCodeService {

    private final QRCodeRepository qrCodeRepository;
    private final LocationRepository locationRepository;

    public QRCodeService(QRCodeRepository qrCodeRepository,
                         LocationRepository locationRepository) {
        this.qrCodeRepository = qrCodeRepository;
        this.locationRepository = locationRepository;
    }

    public List<QRCodeDTO> getAllQRCodes() {

        return qrCodeRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public QRCodeDTO getQRCodeById(Long id) {

        QRCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QR Code not found"));

        return convertToDTO(qrCode);
    }

    public QRCodeDTO getQRCodeByValue(String qrValue) {

        QRCode qrCode = qrCodeRepository.findByQrValue(qrValue)
                .orElseThrow(() -> new RuntimeException("QR Code not found"));

        return convertToDTO(qrCode);
    }

    public QRCodeDTO createQRCode(QRCodeRequest request) {

        if (qrCodeRepository.existsByQrValue(request.getQrValue())) {
            throw new RuntimeException("QR Value already exists");
        }

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        QRCode qrCode = new QRCode();
        qrCode.setQrValue(request.getQrValue());
        qrCode.setLocation(location);

        return convertToDTO(qrCodeRepository.save(qrCode));
    }

    public QRCodeDTO updateQRCode(Long id, QRCodeRequest request) {

        QRCode qrCode = qrCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("QR Code not found"));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        qrCode.setQrValue(request.getQrValue());
        qrCode.setLocation(location);

        return convertToDTO(qrCodeRepository.save(qrCode));
    }

    public void deleteQRCode(Long id) {

        qrCodeRepository.deleteById(id);

    }

    private QRCodeDTO convertToDTO(QRCode qrCode) {

        return new QRCodeDTO(
                qrCode.getQrId(),
                qrCode.getQrValue(),
                qrCode.getLocation().getLocationId()
        );
    }
}