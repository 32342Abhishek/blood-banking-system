package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.User;
import com.example.demo.security.JwtUtils;
import com.example.demo.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private JwtUtils jwtUtils;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Find user by email
            User user = userService.findByUsername(loginRequest.getUsername());
            
            // For existing users without encoded passwords during transition
            boolean passwordMatch = false;
            if (user != null) {
                if (user.getPassword().startsWith("$2a$")) {
                    // Password is already encoded
                    passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
                } else {
                    // Legacy password comparison - for transition period
                    passwordMatch = user.getPassword().equals(loginRequest.getPassword());
                    
                    // Update to encoded password for future logins
                    user.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
                    userService.saveUser(user);
                }
            }
            
            if (user != null && passwordMatch) {
                // Generate JWT token
                String token = jwtUtils.generateJwtToken(user.getEmail(), user.getId(), user.getRole());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during login: " + e.getMessage());
        }
    }
    
    @PostMapping("/admin/login")
    public ResponseEntity<?> adminLogin(@RequestBody LoginRequest loginRequest) {
        try {
            // Find user by email
            User user = userService.findByUsername(loginRequest.getUsername());
            
            // Check if user exists and has admin role
            if (user == null || !"ADMIN".equals(user.getRole())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
            }
            
            // Verify password
            boolean passwordMatch = false;
            if (user.getPassword().startsWith("$2a$")) {
                // Password is already encoded
                passwordMatch = passwordEncoder.matches(loginRequest.getPassword(), user.getPassword());
            } else {
                // Legacy password comparison - for transition period
                passwordMatch = user.getPassword().equals(loginRequest.getPassword());
                
                // Update to encoded password for future logins
                user.setPassword(passwordEncoder.encode(loginRequest.getPassword()));
                userService.saveUser(user);
            }
            
            if (passwordMatch) {
                // Generate JWT token
                String token = jwtUtils.generateJwtToken(user.getEmail(), user.getId(), user.getRole());
                
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("userId", user.getId());
                response.put("name", user.getName());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid admin credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during admin login: " + e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // Check if user already exists
            User existingUser = userService.findByUsername(user.getEmail());
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
            }
            
            // Set default role for new users
            user.setRole("USER");
            
            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save user
            User savedUser = userService.saveUser(user);
            
            // Generate JWT token
            String token = jwtUtils.generateJwtToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put("message", "User registered successfully");
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error during registration: " + e.getMessage());
        }
    }
    
    @PostMapping("/admin/register")
    public ResponseEntity<?> registerAdmin(@RequestBody Map<String, Object> requestBody) {
        System.out.println("Received admin registration request: " + requestBody);
        try {
            User user = new User();
            user.setName((String) requestBody.get("name"));
            
            // Email is used as username in our system
            String email = (String) requestBody.get("email");
            user.setEmail(email);
            
            // If username is provided separately, log it but still use email as the username
            if (requestBody.containsKey("username")) {
                System.out.println("Username provided: " + requestBody.get("username") + " but using email as username: " + email);
            }
            
            user.setPassword((String) requestBody.get("password"));
            
            // Set blood type if provided
            if (requestBody.containsKey("bloodType")) {
                user.setBloodType((String) requestBody.get("bloodType"));
            }
            
            // Check admin registration code
            String adminCode = (String) requestBody.get("registrationCode");
            if (adminCode == null) {
                adminCode = (String) requestBody.get("adminCode"); // Check alternative field name
            }
            
            System.out.println("Admin code received: " + adminCode);
            
            String expectedAdminCode = "ADMIN123"; // This should be stored securely in environment variables or config
            
            System.out.println("Validating admin code: received [" + adminCode + "], expected [" + expectedAdminCode + "]");
            
            if (adminCode == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Admin registration code is required"));
            }
            
            if (!adminCode.equals(expectedAdminCode)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "Invalid admin registration code"));
            }
            
            System.out.println("Admin code validated successfully");
            
            // Check if user already exists
            User existingUser = userService.findByUsername(user.getEmail());
            if (existingUser != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists");
            }
            
            // Set role to ADMIN
            user.setRole("ADMIN");
            
            // Encode password
            user.setPassword(passwordEncoder.encode(user.getPassword()));
            
            // Save admin user
            User savedUser = userService.saveUser(user);
            System.out.println("Admin user saved successfully: " + savedUser.getId() + ", " + savedUser.getName() + ", " + savedUser.getEmail() + ", role: " + savedUser.getRole());
            
            // Generate JWT token
            String token = jwtUtils.generateJwtToken(savedUser.getEmail(), savedUser.getId(), savedUser.getRole());
            System.out.println("JWT token generated successfully");
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", savedUser.getId());
            response.put("name", savedUser.getName());
            response.put("email", savedUser.getEmail());
            response.put("role", savedUser.getRole());
            response.put("message", "Admin user registered successfully");
            
            System.out.println("Returning success response for admin registration");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            e.printStackTrace(); // Log the full stack trace for debugging
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Error during admin registration: " + e.getMessage());
            errorResponse.put("error", e.getClass().getName());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}