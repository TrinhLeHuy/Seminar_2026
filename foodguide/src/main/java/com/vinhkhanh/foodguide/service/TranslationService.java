package com.vinhkhanh.foodguide.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import java.util.*;

@Service
public class TranslationService {

    @Value("${google.translate.api.key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String translate(String text, String targetLang) {
        try {
            String url = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("q", text);
            requestBody.put("target", targetLang);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);

            Map data = (Map) response.getBody().get("data");
            List translations = (List) data.get("translations");
            Map first = (Map) translations.get(0);

            return (String) first.get("translatedText");

        } catch (Exception e) {
            e.printStackTrace();
            return text; // fallback
        }
    }
}