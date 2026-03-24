package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.dto.AudioGuideDTO;
import com.vinhkhanh.foodguide.dto.AudioGuideRequest;
import com.vinhkhanh.foodguide.service.AudioGuideService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/audio-guides")
@CrossOrigin(origins = "*")
public class AudioGuideController {
    @Autowired
    private AudioGuideService audioGuideService;

    @GetMapping
    public ResponseEntity<List<AudioGuideDTO>> getAllAudioGuides() {
        return ResponseEntity.ok(audioGuideService.getAllAudioGuides());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AudioGuideDTO> getAudioGuideById(@PathVariable Long id) {
        try {
            AudioGuideDTO audioGuide = audioGuideService.getAudioGuideById(id);
            return ResponseEntity.ok(audioGuide);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<AudioGuideDTO>> getAudioGuidesByLocation(@PathVariable Long locationId) {
        return ResponseEntity.ok(audioGuideService.getAudioGuidesByLocation(locationId));
    }

    @GetMapping("/location/{locationId}/language/{language}")
    public ResponseEntity<AudioGuideDTO> getAudioGuideByLocationAndLanguage(
            @PathVariable Long locationId,
            @PathVariable String language) {
        try {
            AudioGuideDTO audioGuide = audioGuideService.getAudioGuideByLocationAndLanguage(locationId, language);
            return ResponseEntity.ok(audioGuide);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/language/{language}")
    public ResponseEntity<List<AudioGuideDTO>> getAudioGuidesByLanguage(@PathVariable String language) {
        return ResponseEntity.ok(audioGuideService.getAudioGuidesByLanguage(language));
    }

    @PostMapping
    public ResponseEntity<AudioGuideDTO> createAudioGuide(@Valid @RequestBody AudioGuideRequest request) {
        try {
            AudioGuideDTO audioGuide = audioGuideService.createAudioGuide(request);
            return ResponseEntity.ok(audioGuide);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<AudioGuideDTO> updateAudioGuide(
            @PathVariable Long id,
            @Valid @RequestBody AudioGuideRequest request) {
        try {
            AudioGuideDTO audioGuide = audioGuideService.updateAudioGuide(id, request);
            return ResponseEntity.ok(audioGuide);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAudioGuide(@PathVariable Long id) {
        try {
            audioGuideService.deleteAudioGuide(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
