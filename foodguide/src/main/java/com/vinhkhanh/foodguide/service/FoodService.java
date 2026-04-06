package com.vinhkhanh.foodguide.service;

import com.vinhkhanh.foodguide.dto.FoodDTO;
import com.vinhkhanh.foodguide.dto.FoodRequest;
import com.vinhkhanh.foodguide.entity.Food;
import com.vinhkhanh.foodguide.entity.Location;
import com.vinhkhanh.foodguide.repository.FoodRepository;
import com.vinhkhanh.foodguide.repository.LocationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    @Autowired
    private LocationRepository locationRepository;

    // ✅ GET ALL (THEO LANGUAGE)
    public List<FoodDTO> getAllFoods(String lang) {
        return foodRepository.findAll()
                .stream()
                .map(food -> convertToDTO(food, lang))
                .collect(Collectors.toList());
    }

    // ✅ GET BY ID
    public FoodDTO getFoodById(Long id, String lang) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found with id: " + id));

        return convertToDTO(food, lang);
    }

    // ✅ GET BY LOCATION
    public List<FoodDTO> getFoodsByLocation(Long locationId, String lang) {

        return foodRepository.findByLocationLocationId(locationId)
                .stream()
                .map(food -> convertToDTO(food, lang))
                .collect(Collectors.toList());
    }

    // ✅ CREATE
    public FoodDTO createFood(FoodRequest request) {

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        Food food = new Food();

        food.setNameVi(request.getNameVi());
        food.setNameEn(request.getNameEn());
        food.setDescriptionVi(request.getDescriptionVi());
        food.setDescriptionEn(request.getDescriptionEn());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setLocation(location);

        Food saved = foodRepository.save(food);

        return convertToDTO(saved, "vi");
    }

    // ✅ UPDATE
    public FoodDTO updateFood(Long id, FoodRequest request) {

        Food food = foodRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Food not found"));

        Location location = locationRepository.findById(request.getLocationId())
                .orElseThrow(() -> new RuntimeException("Location not found"));

        food.setNameVi(request.getNameVi());
        food.setNameEn(request.getNameEn());
        food.setDescriptionVi(request.getDescriptionVi());
        food.setDescriptionEn(request.getDescriptionEn());
        food.setPrice(request.getPrice());
        food.setImageUrl(request.getImageUrl());
        food.setLocation(location);

        Food updated = foodRepository.save(food);

        return convertToDTO(updated, "vi");
    }

    // ✅ DELETE
    public void deleteFood(Long id) {

        if (!foodRepository.existsById(id)) {
            throw new RuntimeException("Food not found");
        }

        foodRepository.deleteById(id);
    }

    // ✅ CONVERT ENTITY -> DTO (THEO LANGUAGE)
    private FoodDTO convertToDTO(Food food, String lang) {

        FoodDTO dto = new FoodDTO();

        dto.setFoodId(food.getFoodId());
        dto.setPrice(food.getPrice());
        dto.setImageUrl(food.getImageUrl());
        dto.setLocationId(food.getLocation().getLocationId());
        return dto;
    }
}