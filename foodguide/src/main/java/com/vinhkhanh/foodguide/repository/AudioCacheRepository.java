package com.vinhkhanh.foodguide.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.vinhkhanh.foodguide.entity.AudioCache;

public interface AudioCacheRepository extends JpaRepository<AudioCache, Long> {
    Optional<AudioCache> findByHash(String hash);
}