package com.vinhkhanh.foodguide.repository;

import com.vinhkhanh.foodguide.entity.AudioGuide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AudioGuideRepository extends JpaRepository<AudioGuide, Long> {
    List<AudioGuide> findByLocationLocationId(Long locationId);
    Optional<AudioGuide> findByLocationLocationIdAndLanguage(Long locationId, String language);
    List<AudioGuide> findByLanguage(String language);
}
