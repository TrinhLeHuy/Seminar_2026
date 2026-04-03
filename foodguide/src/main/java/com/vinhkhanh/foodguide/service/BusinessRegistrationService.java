package com.vinhkhanh.foodguide.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vinhkhanh.foodguide.entity.AudioGuide;
import com.vinhkhanh.foodguide.entity.BusinessRegistration;
import com.vinhkhanh.foodguide.entity.Food;
import com.vinhkhanh.foodguide.entity.Location;
import com.vinhkhanh.foodguide.entity.QRCode;
import com.vinhkhanh.foodguide.entity.Status;
import com.vinhkhanh.foodguide.entity.User;
import com.vinhkhanh.foodguide.repository.AudioGuideRepository;
import com.vinhkhanh.foodguide.repository.BusinessRegistrationRepository;
import com.vinhkhanh.foodguide.repository.FoodRepository;
import com.vinhkhanh.foodguide.repository.LocationRepository;
import com.vinhkhanh.foodguide.repository.QRCodeRepository;
import com.vinhkhanh.foodguide.repository.UserRepository;

@Service
public class BusinessRegistrationService {

    @Autowired
    private BusinessRegistrationRepository registrationRepo;

    @Autowired
    private LocationRepository locationRepo;

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private FoodRepository foodRepo;
    @Autowired
    private QRCodeRepository qrRepo;
    @Autowired
    private AudioGuideRepository audioRepo;
    @Autowired
    private EmailService emailService;

    // ================= USER ĐĂNG KÝ =================
    public BusinessRegistration create(BusinessRegistration req, Long userId) {

        // Lấy User entity từ repo
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        req.setUser(user); // set đối tượng user vào BusinessRegistration
        req.setOwnerAccountId(userId); // optional, có thể giữ nếu muốn
        req.setStatus(Status.PENDING);
        req.setCreatedAt(LocalDateTime.now());

        System.out.println("READY TO SAVE REGISTRATION: " + req);
        return registrationRepo.save(req);
    }

    // ================= ADMIN XEM =================
    public List<BusinessRegistration> getPending() {
        return registrationRepo.findByStatus(Status.PENDING);
    }

    // ================= ADMIN DUYỆT =================
    @Transactional
    public void approve(Long id) {

        BusinessRegistration reg = registrationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // ✅ check trạng thái
        if (reg.getStatus() != Status.PENDING) {
            throw new RuntimeException("Already processed");
        }

        // ===== 1. Tạo Location =====
        User user = reg.getUser(); // lấy entity User trực tiếp
        if (user == null) {
            throw new RuntimeException("User not found in registration");
        }

        Location location = locationRepo.save(
                Location.builder()
                        .name(reg.getName())
                        .description(reg.getDescription())
                        .latitude(reg.getLatitude())
                        .longitude(reg.getLongitude())
                        .imageUrl(reg.getImageUrl())
                        .user(user)
                        .build());

        // ===== 2. Tạo Food =====
        Food food = Food.builder()
                .nameVi(reg.getFoodNameVi())
                .nameEn(reg.getFoodNameEn())
                .descriptionVi(reg.getFoodDescriptionVi())
                .descriptionEn(reg.getFoodDescriptionEn())
                .price(reg.getPrice())
                .imageUrl(reg.getFoodImageUrl())
                .location(location)
                .build();

        foodRepo.save(food);

        // ===== 3. Update status =====
        reg.setStatus(Status.APPROVED);
        reg.setApprovedAt(LocalDateTime.now());

        registrationRepo.save(reg);

        // ===== 4. Tạo QR =====
        QRCode qr = QRCode.builder()
                .qrValue("FOOD" + food.getFoodId())
                .location(location)
                .build();

        qrRepo.save(qr);

        // ===== 5. Tạo Audio =====
        String audioUrl = reg.getAudioUrl();
        String audioLanguage = reg.getAudioLanguage();

        AudioGuide audio = AudioGuide.builder()
                .audioUrl(audioUrl)
                .language(audioLanguage)
                .location(location)
                .build();

        audioRepo.save(audio);

        // ===== 6. Gửi email thông báo =====
        System.out.println("SEND EMAIL TO: " + reg.getEmail());
        try {

            String email = reg.getEmail();

            String subject = "Quán ăn của bạn đã được duyệt";

            String content = "Xin chào " + user.getUsername() + ",\n\n" +
                    "Chúc mừng! Quán ăn \"" + reg.getName() + "\" của bạn đã được duyệt.\n\n" +
                    "Món ăn: " + reg.getFoodNameVi() + "\n" +
                    "Giá: " + reg.getPrice() + " VND\n\n" +
                    "Quán của bạn sẽ sớm hiển thị trên ứng dụng.\n\n" +
                    "Trân trọng.";

            emailService.sendEmail(email, subject, content);

        } catch (Exception e) {
            // không làm fail transaction nếu email lỗi
            System.out.println("Send email failed: " + e.getMessage());
        }
    }

    // ================= ADMIN TỪ CHỐI =================
    public void reject(Long id) {

        BusinessRegistration reg = registrationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn"));

        // kiểm tra trạng thái
        if (reg.getStatus() != Status.PENDING) {
            throw new RuntimeException("Đơn đã được xử lý");
        }

        // cập nhật trạng thái
        reg.setStatus(Status.REJECTED);
        reg.setApprovedAt(LocalDateTime.now());

        registrationRepo.save(reg);

        User user = reg.getUser();

        // ===== gửi email thông báo =====
        try {

            String email = reg.getEmail();

            String subject = "Quán ăn của bạn đã bị từ chối";

            String content = "Xin chào " + user.getUsername() + ",\n\n" +
                    "Rất tiếc! Đơn đăng ký quán ăn \"" + reg.getName() + "\" của bạn đã bị từ chối.\n\n" +
                    "Món ăn đăng ký: " + reg.getFoodNameVi() + "\n" +
                    "Giá: " + reg.getPrice() + " VND\n\n" +
                    "Bạn có thể chỉnh sửa thông tin và gửi lại đăng ký.\n\n" +
                    "Trân trọng.";

            emailService.sendEmail(email, subject, content);

            System.out.println("REJECT EMAIL SENT TO: " + email);

        } catch (Exception e) {
            System.out.println("Send reject email failed: " + e.getMessage());
        }
    }
}