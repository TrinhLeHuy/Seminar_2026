package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.TextCache;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TextCacheRepository extends JpaRepository<TextCache, Long> {

    Optional<TextCache> findByHash(String hash);
}