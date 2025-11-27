package com.example.demo.config;

import com.example.demo.model.User;
import com.example.demo.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        initializeAdminUser();
    }

    private void initializeAdminUser() {
        try {
            // Check if admin user already exists
            User existingAdmin = userService.findByUsername("admin@bloodbank.com");
            
            if (existingAdmin == null) {
                // Create default admin user
                User adminUser = new User();
                adminUser.setName("System Administrator");
                adminUser.setEmail("admin@bloodbank.com");
                adminUser.setPassword(passwordEncoder.encode("Admin@123"));
                adminUser.setRole("ADMIN");
                adminUser.setBloodType("O+");
                
                userService.saveUser(adminUser);
                
                logger.info("========================================");
                logger.info("Default Admin User Created Successfully!");
                logger.info("========================================");
                logger.info("Email: admin@bloodbank.com");
                logger.info("Password: Admin@123");
                logger.info("Role: ADMIN");
                logger.info("========================================");
                logger.info("Please change the password after first login!");
                logger.info("========================================");
            } else {
                logger.info("Admin user already exists: " + existingAdmin.getEmail());
                
                // Ensure the admin has the correct role
                if (!"ADMIN".equals(existingAdmin.getRole())) {
                    existingAdmin.setRole("ADMIN");
                    userService.saveUser(existingAdmin);
                    logger.info("Updated user role to ADMIN");
                }
            }
        } catch (Exception e) {
            logger.error("Error initializing admin user: " + e.getMessage(), e);
        }
    }
}
