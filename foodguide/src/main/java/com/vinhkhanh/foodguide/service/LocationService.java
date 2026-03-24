package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.dto.*;
import com.vinhkhanh.foodguide.entity.*;
import com.vinhkhanh.foodguide.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class LocationService {
    @Autowired
    private LocationRepository locationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private AudioGuideRepository audioGuideRepository;

    @Autowired
    private QRCodeRepository qrCodeRepository;

    public List<LocationDTO> getAllLocations() {
        return locationRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public LocationDetailDTO getLocationById(Long id) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found with id: " + id));
        return convertToDetailDTO(location);
    }

    public LocationDetailDTO getLocationByQRCode(String qrValue) {
        QRCode qrCode = qrCodeRepository.findByQrValue(qrValue)
                .orElseThrow(() -> new RuntimeException("QR Code not found: " + qrValue));
        return convertToDetailDTO(qrCode.getLocation());
    }

    public LocationDTO createLocation(LocationRequest request, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Location location = new Location();
        location.setName(request.getName());
        location.setDescription(request.getDescription());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setImageUrl(request.getImageUrl());
        location.setUser(user);

        Location saved = locationRepository.save(location);
        return convertToDTO(saved);
    }

    public LocationDTO updateLocation(Long id, LocationRequest request) {
        Location location = locationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Location not found"));

        location.setName(request.getName());
        location.setDescription(request.getDescription());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setImageUrl(request.getImageUrl());

        Location updated = locationRepository.save(location);
        return convertToDTO(updated);
    }

    public void deleteLocation(Long id) {
        locationRepository.deleteById(id);
    }

    public List<LocationDTO> getLocationsByUser(Long userId) {
        return locationRepository.findByUserUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    private LocationDTO convertToDTO(Location location) {
        LocationDTO dto = new LocationDTO();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
        dto.setDescription(location.getDescription());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setImageUrl(location.getImageUrl());
        dto.setUserId(location.getUser() != null ? location.getUser().getUserId() : null);

        if (location.getFoods() != null) {
            dto.setFoods(location.getFoods().stream()
                    .map(this::convertFoodToDTO)
                    .collect(Collectors.toList()));
        }

        if (location.getAudioGuides() != null) {
            dto.setAudioGuides(location.getAudioGuides().stream()
                    .map(this::convertAudioGuideToDTO)
                    .collect(Collectors.toList()));
        }

        if (location.getQrCodes() != null && !location.getQrCodes().isEmpty()) {
            dto.setQrCode(convertQRCodeToDTO(location.getQrCodes().get(0)));
        }

        return dto;
    }

    private LocationDetailDTO convertToDetailDTO(Location location) {
        LocationDetailDTO dto = new LocationDetailDTO();
        dto.setLocationId(location.getLocationId());
        dto.setName(location.getName());
        dto.setDescription(location.getDescription());
        dto.setLatitude(location.getLatitude());
        dto.setLongitude(location.getLongitude());
        dto.setImageUrl(location.getImageUrl());

        if (location.getFoods() != null) {
            dto.setFoods(location.getFoods().stream()
                    .map(this::convertFoodToDTO)
                    .collect(Collectors.toList()));
        }

        if (location.getAudioGuides() != null) {
            dto.setAudioGuides(location.getAudioGuides().stream()
                    .map(this::convertAudioGuideToDTO)
                    .collect(Collectors.toList()));
        }

        if (location.getQrCodes() != null && !location.getQrCodes().isEmpty()) {
            dto.setQrCode(convertQRCodeToDTO(location.getQrCodes().get(0)));
        }

        return dto;
    }

    private FoodDTO convertFoodToDTO(Food food) {
        FoodDTO dto = new FoodDTO();
        dto.setFoodId(food.getFoodId());
        dto.setName(food.getNameVi());
        dto.setPrice(food.getPrice());
        dto.setDescription(food.getDescriptionVi());
        dto.setLocationId(food.getLocation().getLocationId());
        return dto;
    }

    private AudioGuideDTO convertAudioGuideToDTO(AudioGuide audioGuide) {
        AudioGuideDTO dto = new AudioGuideDTO();
        dto.setAudioId(audioGuide.getAudioId());
        dto.setAudioUrl(audioGuide.getAudioUrl());
        dto.setLanguage(audioGuide.getLanguage());
        dto.setLocationId(audioGuide.getLocation().getLocationId());
        return dto;
    }

    private QRCodeDTO convertQRCodeToDTO(QRCode qrCode) {
        QRCodeDTO dto = new QRCodeDTO();
        dto.setQrId(qrCode.getQrId());
        dto.setQrValue(qrCode.getQrValue());
        dto.setLocationId(qrCode.getLocation().getLocationId());
        return dto;
    }
}
