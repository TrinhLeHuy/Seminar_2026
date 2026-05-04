package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.service.TTSService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tts")
public class TTSController {

    @Autowired
    private TTSService ttsService;

    @GetMapping
    public ResponseEntity<String> getTTS(
            @RequestParam Long locationId,
            @RequestParam String lang) {

        String audioUrl = ttsService.getOrCreateAudio(locationId, lang);
        return ResponseEntity.ok(audioUrl);
    }

    @GetMapping("/text")
    public ResponseEntity<String> getText(
            @RequestParam Long locationId,
            @RequestParam String lang) {
 System.out.println("➡️ REQUEST TTS: locationId=" + locationId + ", lang=" + lang);
        String text = ttsService.getTranslatedText(locationId, lang);
        return ResponseEntity.ok(text);
    }
}
