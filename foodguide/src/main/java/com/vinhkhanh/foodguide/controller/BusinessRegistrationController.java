package com.vinhkhanh.foodguide.controller;

import com.vinhkhanh.foodguide.entity.User;
import com.vinhkhanh.foodguide.entity.BusinessRegistration;
import com.vinhkhanh.foodguide.repository.BusinessRegistrationRepository;
import com.vinhkhanh.foodguide.repository.UserRepository;
import com.vinhkhanh.foodguide.service.BusinessRegistrationService;
import org.springframework.security.core.Authentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/business")
public class BusinessRegistrationController {

    @Autowired
    private BusinessRegistrationService service;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BusinessRegistrationRepository businessRepo;

    // ================= USER ĐĂNG KÝ =================
    // @PreAuthorize("hasRole('USER')")
    // @PostMapping("/register")
    // public BusinessRegistration register(
    // @RequestBody BusinessRegistration req,
    // HttpServletRequest request) {

    // // 🔥 LẤY userId từ token
    // String token = request.getHeader("Authorization").substring(7);
    // Long userId = jwtUtil.extractUserId(token);

    // return service.create(req, userId);
    // }

    @PostMapping("/register")
    public ResponseEntity<?> registerBusiness(
            @RequestBody BusinessRegistration req,
            Authentication auth) {
        String username = auth.getName();

        User user = userRepository.findByUsername(username)
                .orElseThrow();

        BusinessRegistration saved = service.create(req, user.getUserId());

        return ResponseEntity.ok(java.util.Map.of(
                "message", "Đăng ký quán thành công",
                "status", "SUCCESS",
                "data", saved));
    }

    // ================= ADMIN XEM PENDING =================
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/pending")
    public List<BusinessRegistration> getPending() {
        return service.getPending();
    }

    // ================= ADMIN DUYỆT =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/approve/{id}")
    public String approve(@PathVariable Long id) {
        service.approve(id);
        return "Approved";
    }

    // ================= ADMIN TỪ CHỐI =================
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/reject/{id}")
    public String reject(@PathVariable Long id) {
        service.reject(id);
        return "Rejected";
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBusinessById(@PathVariable Long id) {
        return businessRepo.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}