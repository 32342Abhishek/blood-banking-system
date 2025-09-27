package com.example.demo.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * A controller for testing API accessibility and CORS configuration
 */
@RestController
@RequestMapping("/api/test")
public class TestController {

    /**
     * Simple endpoint to check if API is accessible
     * @return A success message
     */
    @GetMapping("/ping")
    public ResponseEntity<Map<String, Object>> ping() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "API is accessible");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }
}