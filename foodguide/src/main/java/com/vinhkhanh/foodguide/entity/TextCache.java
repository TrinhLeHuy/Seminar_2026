package com.vinhkhanh.foodguide.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TextCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long locationId;
    private String lang;
    @Column(unique = true)
    private String hash;

    @Column(columnDefinition = "TEXT")
    private String content;
}