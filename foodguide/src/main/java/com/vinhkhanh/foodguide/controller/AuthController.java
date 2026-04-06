package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.dto.JwtResponse;
import com.vinhkhanh.foodguide.dto.LoginRequest;
import com.vinhkhanh.foodguide.dto.RegisterRequest;
import com.vinhkhanh.foodguide.service.AuthService;
import jakarta.validation.Valid;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.vinhkhanh.foodguide.entity.User;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid username or password");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            User user = authService.register(registerRequest);
            return ResponseEntity.ok(Map.of(
                    "id", user.getUserId(),
                    "username", user.getUsername(),
                    "email", user.getEmail(),
                    "role", user.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
