package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.dto.AudioGuideDTO;
import com.vinhkhanh.foodguide.dto.AudioGuideRequest;
import com.vinhkhanh.foodguide.entity.AudioGuide;
import com.vinhkhanh.foodguide.entity.Location;
import com.vinhkhanh.foodguide.repository.AudioGuideRepository;
import com.vinhkhanh.foodguide.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AudioGuideService {
    @Autowired
    private AudioGuideRepository audioGuideRepository;

    @Autowired
    private LocationRepository locationRepository;

    public List<AudioGuideDTO> getAllAudioGuides() {
        return audioGuideRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AudioGuideDTO getAudioGuideById(Long id) {
        AudioGuide audioGuide = audioGuideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio guide not found with id: " + id));
        return convertToDTO(audioGuide);
    }

    public List<AudioGuideDTO> getAudioGuidesByLocation(Long locationId) {
        return audioGuideRepository.findByLocationLocationId(locationId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AudioGuideDTO getAudioGuideByLocationAndLanguage(Long locationId, String language) {
        AudioGuide audioGuide = audioGuideRepository.findByLocationLocationIdAndLanguage(locationId, language)
                .orElseThrow(() -> new RuntimeException("Audio guide not found for location: " + locationId + " and language: " + language));
        return convertToDTO(audioGuide);
    }

    public List<AudioGuideDTO> getAudioGuidesByLanguage(String language) {
        return audioGuideRepository.findByLanguage(language).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public AudioGuideDTO createAudioGuide(AudioGuideRequest request) {
        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        AudioGuide audioGuide = new AudioGuide();
        audioGuide.setAudioUrl(request.getAudioUrl());
        audioGuide.setLanguage(request.getLanguage());
        audioGuide.setLocation(location);

        AudioGuide saved = audioGuideRepository.save(audioGuide);
        return convertToDTO(saved);
    }

    public AudioGuideDTO updateAudioGuide(Long id, AudioGuideRequest request) {
        AudioGuide audioGuide = audioGuideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Audio guide not found"));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        audioGuide.setAudioUrl(request.getAudioUrl());
        audioGuide.setLanguage(request.getLanguage());
        audioGuide.setLocation(location);

        AudioGuide updated = audioGuideRepository.save(audioGuide);
        return convertToDTO(updated);
    }

    public void deleteAudioGuide(Long id) {
        audioGuideRepository.deleteById(id);
    }

    private AudioGuideDTO convertToDTO(AudioGuide audioGuide) {
        AudioGuideDTO dto = new AudioGuideDTO();
        dto.setAudioId(audioGuide.getAudioId());
        dto.setAudioUrl(audioGuide.getAudioUrl());
        dto.setLanguage(audioGuide.getLanguage());
        dto.setLocationId(audioGuide.getLocation().getLocationId());
        return dto;
    }
}
