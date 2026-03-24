package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.QRCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface QRCodeRepository extends JpaRepository<QRCode, Long> {

    Optional<QRCode> findByQrValue(String qrValue);

    boolean existsByQrValue(String qrValue);

}