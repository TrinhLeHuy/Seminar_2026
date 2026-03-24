package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.dto.FoodDTO;
import com.vinhkhanh.foodguide.dto.FoodRequest;
import com.vinhkhanh.foodguide.service.FoodService;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    // =============================
    // GET ALL FOODS
    // =============================
   @GetMapping
    public ResponseEntity<List<FoodDTO>> getAllFoods(
            @RequestParam(defaultValue = "vi") String lang) {

        return ResponseEntity.ok(foodService.getAllFoods(lang));
    }
    // =============================
    // GET FOOD BY ID
    // =============================
    @GetMapping("/{id}")
    public ResponseEntity<?> getFoodById(@PathVariable Long id) {
        try {
            FoodDTO food = foodService.getFoodById(id, "vi");
            return ResponseEntity.ok(food);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Food not found with id: " + id);
        }
    }

    // =============================
    // GET FOODS BY LOCATION
    // =============================
    @GetMapping("/location/{locationId}")
    public ResponseEntity<List<FoodDTO>> getFoodsByLocation(
            @PathVariable Long locationId) {

        List<FoodDTO> foods = foodService.getFoodsByLocation(locationId, "vi");
        return ResponseEntity.ok(foods);
    }

    // =============================
    // CREATE FOOD
    // =============================
    @PostMapping
    public ResponseEntity<?> createFood(
            @Valid @RequestBody FoodRequest request) {

        try {
            FoodDTO createdFood = foodService.createFood(request);
            return ResponseEntity.ok(createdFood);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Cannot create food: " + e.getMessage());
        }
    }

    // =============================
    // UPDATE FOOD
    // =============================
    @PutMapping("/{id}")
    public ResponseEntity<?> updateFood(
            @PathVariable Long id,
            @Valid @RequestBody FoodRequest request) {

        try {
            FoodDTO updatedFood = foodService.updateFood(id, request);
            return ResponseEntity.ok(updatedFood);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Food not found with id: " + id);
        }
    }

    // =============================
    // DELETE FOOD
    // =============================
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFood(@PathVariable Long id) {

        try {
            foodService.deleteFood(id);
            return ResponseEntity.ok("Food deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Food not found with id: " + id);
        }
    }
}