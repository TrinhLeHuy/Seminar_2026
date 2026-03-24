package com.vinhkhanh.foodguide.config;

import com.vinhkhanh.foodguide.entity.User;
import com.vinhkhanh.foodguide.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class DataInitializer implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize admin user with hashed password
        Optional<User> adminUser = userRepository.findByUsername("admin");
        if (adminUser.isPresent()) {
            User admin = adminUser.get();
            if (!admin.getPassword().startsWith("$2a$")) { // Check if password is not already hashed
                admin.setPassword(passwordEncoder.encode(admin.getPassword()));
                userRepository.save(admin);
            }
        } else {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("123456"));
            admin.setRole("ADMIN");
            userRepository.save(admin);
        }

        // Initialize guest user with hashed password
        Optional<User> guestUser = userRepository.findByUsername("guest");
        if (guestUser.isPresent()) {
            User guest = guestUser.get();
            if (!guest.getPassword().startsWith("$2a$")) { // Check if password is not already hashed
                guest.setPassword(passwordEncoder.encode(guest.getPassword()));
                userRepository.save(guest);
            }
        } else {
            User guest = new User();
            guest.setUsername("guest");
            guest.setPassword(passwordEncoder.encode("123456"));
            guest.setRole("USER");
            userRepository.save(guest);
        }
    }
}
