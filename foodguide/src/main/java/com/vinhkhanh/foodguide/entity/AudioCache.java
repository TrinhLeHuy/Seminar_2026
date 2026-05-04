package com.vinhkhanh.foodguide.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@Table(name = "audio_cache")
public class AudioCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long locationId;
    private String lang;
    private String hash;
    private String audioUrl;

    private LocalDateTime createdAt = LocalDateTime.now();

    public AudioCache() {
    }

    public AudioCache(Long locationId, String lang, String hash, String audioUrl) {
        this.locationId = locationId;
        this.lang = lang;
        this.hash = hash;
        this.audioUrl = audioUrl;
    }

    // getters/setters
}