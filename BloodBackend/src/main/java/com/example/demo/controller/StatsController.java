package com.example.demo.controller;

import com.example.demo.dto.StatsResponseDto;
import com.example.demo.service.DatabaseStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Controller for retrieving blood bank system statistics
 */
@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class StatsController {

    private final DatabaseStatsService databaseStatsService;
    
    @Autowired
    public StatsController(DatabaseStatsService databaseStatsService) {
        this.databaseStatsService = databaseStatsService;
    }
    
    /**
     * Get overall system statistics
     * 
     * @return Map containing overall statistics
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getOverallStats() {
        return ResponseEntity.ok(databaseStatsService.getOverallStats());
    }
    
    /**
     * Get donor statistics
     * 
     * @return Map containing donor statistics
     */
    @GetMapping("/donors")
    public ResponseEntity<Map<String, Object>> getDonorStats() {
        return ResponseEntity.ok(databaseStatsService.getDonorStats());
    }
    
    /**
     * Get donation statistics
     * 
     * @return Map containing donation statistics
     */
    @GetMapping("/donations")
    public ResponseEntity<Map<String, Object>> getDonationStats() {
        return ResponseEntity.ok(databaseStatsService.getDonationStats());
    }
    
    /**
     * Get inventory statistics
     * 
     * @return Map containing inventory statistics
     */
    @GetMapping("/inventory")
    public ResponseEntity<Map<String, Object>> getInventoryStats() {
        return ResponseEntity.ok(databaseStatsService.getInventoryStats());
    }
    
    /**
     * Get blood request statistics
     * 
     * @return Map containing blood request statistics
     */
    @GetMapping("/requests")
    public ResponseEntity<Map<String, Object>> getRequestStats() {
        return ResponseEntity.ok(databaseStatsService.getRequestStats());
    }
    
    /**
     * Get blood group distribution
     * 
     * @return Map containing blood group distribution
     */
    @GetMapping("/blood-groups")
    public ResponseEntity<Map<String, Integer>> getBloodGroupDistribution() {
        return ResponseEntity.ok(databaseStatsService.getBloodGroupDistribution());
    }
    
    /**
     * Get donor location distribution
     * 
     * @return Map containing donor location distribution
     */
    @GetMapping("/donor-locations")
    public ResponseEntity<Map<String, Integer>> getDonorLocationDistribution() {
        return ResponseEntity.ok(databaseStatsService.getDonorLocationDistribution());
    }
    
    /**
     * Get detailed system statistics with critical info
     * 
     * @return StatsResponseDto containing comprehensive system statistics
     */
    @GetMapping("/system")
    public ResponseEntity<StatsResponseDto> getSystemStats() {
        return ResponseEntity.ok(databaseStatsService.getSystemStats());
    }
}