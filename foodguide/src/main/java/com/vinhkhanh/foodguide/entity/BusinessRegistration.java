package com.vinhkhanh.foodguide.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "business_registrations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusinessRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "business_registration_id")
    private Long id;

    // ===== LOCATION =====
    @Column(nullable = false)
    private String name;
    @Column(nullable = false)
    private String email;
    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnore
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // user thực tế

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "address")
    private String address; // thay vì 'location' để tránh trùng tên class

    @Column(nullable = false)
    private Double latitude;

    @Column(nullable = false)
    private Double longitude;

    @Column(name = "image_url")
    private String imageUrl;

    @Column(name = "owner_account_id")
    private Long ownerAccountId; // optional, có thể bỏ nếu dùng user liên kết

    // ===== STATUS =====
    @Enumerated(EnumType.STRING)
    private Status status;

    // ===== FOOD =====

    @Column(name = "food_name_vi")
    private String foodNameVi;

    @Column(name = "food_name_en")
    private String foodNameEn;

    @Column(name = "price")
    private Double price;

    @Column(name = "food_description_vi", columnDefinition = "TEXT")
    private String foodDescriptionVi;

    @Column(name = "food_description_en", columnDefinition = "TEXT")
    private String foodDescriptionEn;

    @Column(name = "food_image_url")
    private String foodImageUrl;

    // ===== AUDIO =====
    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "audio_language")
    private String audioLanguage;

    // ===== TIME =====
    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;
}