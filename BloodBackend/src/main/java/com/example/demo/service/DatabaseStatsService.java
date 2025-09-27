package com.example.demo.service;

import com.example.demo.dto.StatsResponseDto;
import java.util.Map;

/**
 * Service for retrieving statistics and metrics about the blood bank system
 */
public interface DatabaseStatsService {
    
    /**
     * Get statistics about donors
     * 
     * @return Map containing donor statistics
     */
    Map<String, Object> getDonorStats();
    
    /**
     * Get statistics about blood donations
     * 
     * @return Map containing blood donation statistics
     */
    Map<String, Object> getDonationStats();
    
    /**
     * Get statistics about blood inventory
     * 
     * @return Map containing blood inventory statistics
     */
    Map<String, Object> getInventoryStats();
    
    /**
     * Get statistics about blood requests
     * 
     * @return Map containing blood request statistics
     */
    Map<String, Object> getRequestStats();
    
    /**
     * Get overall system statistics
     * 
     * @return Map containing overall system statistics
     */
    Map<String, Object> getOverallStats();
    
    /**
     * Get blood group distribution
     * 
     * @return Map containing blood group distribution
     */
    Map<String, Integer> getBloodGroupDistribution();
    
    /**
     * Get donor location distribution
     * 
     * @return Map containing donor location distribution
     */
    Map<String, Integer> getDonorLocationDistribution();
    
    /**
     * Get comprehensive system statistics in DTO format
     *
     * @return StatsResponseDto containing detailed system statistics
     */
    StatsResponseDto getSystemStats();
}