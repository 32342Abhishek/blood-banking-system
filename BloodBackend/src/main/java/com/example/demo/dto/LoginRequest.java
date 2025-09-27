package com.example.demo.dto;

/**
 * Data Transfer Object for login requests
 * Can accept either username or email for authentication
 */
public class LoginRequest {
    private String email;
    private String password;
    private String username;

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    /**
     * Get username or email depending on what was provided
     * @return the username or email for authentication
     */
    public String getUsername() {
        // If username is null or empty, return email instead
        return (username == null || username.isEmpty()) ? email : username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}