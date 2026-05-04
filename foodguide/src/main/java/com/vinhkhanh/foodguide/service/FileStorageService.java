package com.vinhkhanh.foodguide.service;

import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileOutputStream;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String UPLOAD_DIR = "uploads/audio/";

    public String saveAudio(byte[] audioBytes) {
        try {
            File dir = new File(UPLOAD_DIR);
            if (!dir.exists())
                dir.mkdirs();

            String fileName = UUID.randomUUID() + ".mp3";
            String fullPath = UPLOAD_DIR + fileName;

            FileOutputStream fos = new FileOutputStream(fullPath);
            fos.write(audioBytes);
            fos.close();

            // URL trả về cho frontend
            return "/uploads/audio/" + fileName;

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Save audio failed");
        }
    }
}