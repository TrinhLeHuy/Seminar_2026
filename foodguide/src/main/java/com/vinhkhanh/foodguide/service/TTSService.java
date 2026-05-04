// package com.vinhkhanh.foodguide.service;

// import com.vinhkhanh.foodguide.entity.*;
// import com.vinhkhanh.foodguide.repository.*;

// import jakarta.persistence.criteria.Path;

// import org.apache.commons.codec.digest.DigestUtils;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Value;
// import org.springframework.http.*;
// import org.springframework.stereotype.Service;
// import org.springframework.web.client.RestTemplate;

// import java.io.File;
// import java.io.FileOutputStream;
// import java.nio.file.Files;
// import java.nio.file.Paths;
// import java.time.LocalDateTime;
// import java.util.*;

// @Service
// public class TTSService {

//     @Autowired
//     private LocationRepository locationRepository;

//     @Autowired
//     private AudioCacheRepository audioCacheRepository;
//     @Autowired
//     private TextCacheRepository textCacheRepository;
//     @Value("${google.api.key}")
//     private String apiKey;

//     @Value("${file.upload-dir}")
//     private String uploadDir;

//     // =============================
//     public String getOrCreateAudio(Long locationId, String lang) {

//         Location location = locationRepository.findById(locationId)
//                 .orElseThrow();

//         String text = buildText(location, lang);

//         String finalText;

//         if (lang.equals("vi") || lang.equals("en")) {
//             finalText = text;
//         } else {
//             finalText = translate(text, lang);
//         }

//         String hash = DigestUtils.md5Hex(finalText + lang);

//         Optional<AudioCache> cache = audioCacheRepository.findByHash(hash);

//         if (cache.isPresent()) {
//             return cache.get().getAudioUrl();
//         }

//         String fileName = googleTTS(finalText, lang);

//         String audioUrl = "http://192.168.1.167:8080/uploads/" + fileName;

//         audioCacheRepository.save(
//                 new AudioCache(locationId, lang, hash, audioUrl));

//         return audioUrl;
//     }

//     public String getTranslatedText(Long locationId, String lang) {

//         Location location = locationRepository.findById(locationId)
//                 .orElseThrow();

//         // 🔥 build text theo ngôn ngữ
//         String text = buildText(location, lang);

//         // 🔥 KHÔNG dịch nếu là vi hoặc en
//         if (lang.equals("vi") || lang.equals("en")) {
//             return text;
//         }

//         // 🔥 chỉ cache khi cần dịch
//         String hash = DigestUtils.md5Hex(text + lang);

//         Optional<TextCache> cache = textCacheRepository.findByHash(hash);

//         if (cache.isPresent()) {
//             return cache.get().getContent();
//         }

//         String translated = translate(text, lang);

//         textCacheRepository.save(
//                 new TextCache(null, locationId, lang, hash, translated));

//         return translated;
//     }

//     // =============================
//     private String buildText(Location location, String lang) {
//         StringBuilder sb = new StringBuilder();

//         sb.append(location.getName()).append(". ");
//         sb.append(location.getDescription()).append(". ");

//         if (location.getFoods() != null) {
//             for (Food f : location.getFoods()) {

//                 if (lang.equals("vi")) {
//                     sb.append(f.getNameVi()).append(". ");
//                     sb.append(f.getDescriptionVi()).append(". ");
//                 } else {
//                     sb.append(
//                             Optional.ofNullable(f.getNameEn()).orElse(f.getNameVi())).append(". ");

//                     sb.append(
//                             Optional.ofNullable(f.getDescriptionEn()).orElse(f.getDescriptionVi())).append(". ");
//                 }
//             }
//         }

//         return sb.toString();
//     }

//     private String translate(String text, String targetLang) {
//         try {
//             RestTemplate restTemplate = new RestTemplate();

//             String url = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;

//             Map<String, Object> body = new HashMap<>();
//             body.put("q", text);
//             body.put("target", targetLang);

//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.APPLICATION_JSON);

//             HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

//             Map response = restTemplate.postForObject(url, entity, Map.class);

//             Map data = (Map) response.get("data");
//             List translations = (List) data.get("translations");

//             Map first = (Map) translations.get(0);

//             return (String) first.get("translatedText");

//         } catch (Exception e) {
//             return text;
//         }
//     }

//     private String googleTTS(String text, String lang) {

//         try {
//             RestTemplate restTemplate = new RestTemplate();

//             String url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey;

//             Map<String, Object> body = new HashMap<>();

//             body.put("input", Map.of("text", text));

//             body.put("voice", Map.of(
//                     "languageCode", mapLang(lang),
//                     "name", mapVoice(lang)));

//             body.put("audioConfig", Map.of(
//                     "audioEncoding", "MP3"));

//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.APPLICATION_JSON);

//             HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

//             Map response = restTemplate.postForObject(url, entity, Map.class);

//             String audioContent = (String) response.get("audioContent");

//             byte[] audioBytes = Base64.getDecoder().decode(audioContent);

//             String fileName = UUID.randomUUID() + ".mp3";

//             java.nio.file.Path path = Paths.get(uploadDir + fileName);

//             Files.createDirectories(path.getParent());
//             Files.write(path, audioBytes);

//             return fileName;

//         } catch (Exception e) {
//             throw new RuntimeException("TTS failed");
//         }
//     }

//     private String mapLang(String lang) {
//         return switch (lang) {
//             case "vi" -> "vi-VN";
//             case "en" -> "en-US";
//             case "zh" -> "cmn-CN";
//             case "ko" -> "ko-KR";
//             case "ja" -> "ja-JP";
//              case "th" -> "th-TH";
//             default -> "en-US";

//         };
//     }

//     private String mapVoice(String lang) {
//         return switch (lang) {
//             case "vi" -> "vi-VN-Standard-A";
//             case "en" -> "en-US-Standard-C";
//             case "zh" -> "cmn-CN-Standard-A";
//             case "ko" -> "ko-KR-Standard-A";
//             case "ja" -> "ja-JP-Standard-A";
//             case "th" -> "th-TH-Standard-A";
//             default -> "en-US-Standard-C";

//         };
//     }

// }
package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.entity.*;
import com.vinhkhanh.foodguide.repository.*;

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

@Service
public class TTSService {

    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private AudioCacheRepository audioCacheRepository;

    @Autowired
    private TextCacheRepository textCacheRepository;

    @Value("${google.api.key}")
    private String apiKey;

    @Value("${file.upload-dir}")
    private String uploadDir;

    private String normalize(String text) {
        return text == null ? "" : text.trim().replaceAll("\\s+", " ");
    }

    private String buildHash(String text, String lang) {
        String normalized = normalize(text);
        return DigestUtils.md5Hex(normalized + "|" + lang);
    }

    // =============================
    // 🎯 NORMALIZE LANG (LUÔN VỀ 1 FORMAT DUY NHẤT)
    private String normalizeLang(String lang) {

        if (lang == null)
            return "en";

        return switch (lang) {
            case "vi", "vi-VN" -> "vi";
            case "en", "en-US" -> "en";
            case "zh", "zh-CN", "cmn-CN" -> "zh";
            case "ko", "ko-KR" -> "ko";
            case "ja", "ja-JP" -> "ja";
            case "th", "th-TH" -> "th";
            default -> "en";
        };
    }

    // =============================
    public String getOrCreateAudio(Long locationId, String lang) {

        String dbLang = normalizeLang(lang);

        Location location = locationRepository.findById(locationId)
                .orElseThrow();

        String text = buildText(location, dbLang);

        String finalText;

        if (dbLang.equals("vi") || dbLang.equals("en")) {
            finalText = normalize(text);
        } else {
            String textHash = buildHash(text, dbLang);

            Optional<TextCache> textCache = textCacheRepository.findByHash(textHash);

            if (textCache.isPresent()) {
                finalText = textCache.get().getContent();
            } else {
                finalText = normalize(translate(text, dbLang));

                textCacheRepository.save(
                        TextCache.builder()
                                .locationId(locationId)
                                .lang(dbLang)
                                .hash(textHash)
                                .content(finalText)
                                .build());
            }
        }

        // 🔥 FIX: chuẩn hoá text trước khi hash (QUAN TRỌNG)
        String hash = buildHash(finalText, dbLang);

        Optional<AudioCache> cache = audioCacheRepository.findByHash(hash);

        if (cache.isPresent()) {
            return cache.get().getAudioUrl();
        }

        String fileName = googleTTS(finalText, dbLang);

        String audioUrl = "http://172.23.200.167:8080/uploads/" + fileName;

        audioCacheRepository.save(
                new AudioCache(locationId, dbLang, hash, audioUrl));

        return audioUrl;
    }

    // =============================
    public String getTranslatedText(Long locationId, String lang) {

        String dbLang = normalizeLang(lang);

        Location location = locationRepository.findById(locationId)
                .orElseThrow();

        String text = buildText(location, dbLang);

        if (dbLang.equals("vi") || dbLang.equals("en")) {
            return text;
        }

        String hash = buildHash(text, dbLang);

        Optional<TextCache> cache = textCacheRepository.findByHash(hash);

        if (cache.isPresent()) {
            return cache.get().getContent();
        }

        String translated = translate(text, dbLang);

        String normalized = normalize(translated);

        textCacheRepository.save(
                TextCache.builder()
                        .locationId(locationId)
                        .lang(dbLang)
                        .hash(hash)
                        .content(normalized)
                        .build());

        return normalized;
    }

    // =============================
    private String buildText(Location location, String lang) {

        StringBuilder sb = new StringBuilder();

        sb.append(location.getName()).append(". ");
        sb.append(location.getDescription()).append(". ");

        if (location.getFoods() != null) {
            for (Food f : location.getFoods()) {

                if (lang.equals("vi")) {
                    sb.append(f.getNameVi()).append(". ");
                    sb.append(f.getDescriptionVi()).append(". ");
                } else {
                    sb.append(Optional.ofNullable(f.getNameEn()).orElse(f.getNameVi())).append(". ");
                    sb.append(Optional.ofNullable(f.getDescriptionEn()).orElse(f.getDescriptionVi())).append(". ");
                }
            }
        }

        return sb.toString();
    }

    // =============================
    private String translate(String text, String targetLang) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            String url = "https://translation.googleapis.com/language/translate/v2?key=" + apiKey;

            Map<String, Object> body = new HashMap<>();
            body.put("q", text);
            body.put("target", targetLang);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            Map data = (Map) response.get("data");
            List translations = (List) data.get("translations");

            Map first = (Map) translations.get(0);

            return (String) first.get("translatedText");

        } catch (Exception e) {
            return text;
        }
    }

    // =============================
    private String googleTTS(String text, String lang) {

        try {
            RestTemplate restTemplate = new RestTemplate();

            String url = "https://texttospeech.googleapis.com/v1/text:synthesize?key=" + apiKey;

            Map<String, Object> body = new HashMap<>();

            body.put("input", Map.of("text", text));

            body.put("voice", Map.of(
                    "languageCode", mapLang(lang),
                    "name", mapVoice(lang)));

            body.put("audioConfig", Map.of(
                    "audioEncoding", "MP3"));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            Map response = restTemplate.postForObject(url, entity, Map.class);

            String audioContent = (String) response.get("audioContent");

            byte[] audioBytes = Base64.getDecoder().decode(audioContent);

            String fileName = UUID.randomUUID() + ".mp3";

            java.nio.file.Path path = Paths.get(uploadDir + fileName);

            Files.createDirectories(path.getParent());
            Files.write(path, audioBytes);

            return fileName;

        } catch (Exception e) {
            throw new RuntimeException("TTS failed", e);
        }
    }

    // =============================
    private String mapLang(String lang) {
        return switch (lang) {
            case "vi" -> "vi-VN";
            case "en" -> "en-US";
            case "zh" -> "cmn-CN";
            case "ko" -> "ko-KR";
            case "ja" -> "ja-JP";
            case "th" -> "th-TH";
            default -> "en-US";
        };
    }

    private String mapVoice(String lang) {
        return switch (lang) {
            case "vi" -> "vi-VN-Standard-A";
            case "en" -> "en-US-Standard-C";
            case "zh" -> "cmn-CN-Standard-A";
            case "ko" -> "ko-KR-Standard-A";
            case "ja" -> "ja-JP-Standard-A";
            case "th" -> "th-TH-Standard-A";
            default -> "en-US-Standard-C";
        };
    }
}