package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.QRScanLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QRScanLogRepository extends JpaRepository<QRScanLog, Long> {

    Long countByQrCodeQrId(Long qrId);

}