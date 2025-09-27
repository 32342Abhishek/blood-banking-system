package com.example.demo.service;

import com.example.demo.model.EmergencyNotification;
import com.example.demo.model.Hospital;

import java.util.List;
import java.util.Optional;

public interface EmergencyNotificationService {
    
    /**
     * Save an emergency notification
     * 
     * @param notification The emergency notification to save
     * @return The saved emergency notification
     */
    EmergencyNotification saveNotification(EmergencyNotification notification);
    
    /**
     * Get an emergency notification by ID
     * 
     * @param id The ID of the emergency notification to retrieve
     * @return An Optional containing the emergency notification if found
     */
    Optional<EmergencyNotification> getNotificationById(Long id);
    
    /**
     * Get all emergency notifications
     * 
     * @return A list of all emergency notifications
     */
    List<EmergencyNotification> getAllNotifications();
    
    /**
     * Get all active emergency notifications
     * 
     * @return A list of all active emergency notifications
     */
    List<EmergencyNotification> getActiveNotifications();
    
    /**
     * Get active emergency notifications for a specific blood type
     * 
     * @param bloodType The blood type to filter by
     * @return A list of active emergency notifications for the specified blood type
     */
    List<EmergencyNotification> getActiveNotificationsByBloodType(String bloodType);
    
    /**
     * Get emergency notifications by hospital
     * 
     * @param hospitalId The hospital ID to filter by
     * @return A list of emergency notifications for the specified hospital
     */
    List<EmergencyNotification> getNotificationsByHospital(Long hospitalId);
    
    /**
     * Create a hospital emergency notification
     * 
     * @param notification The emergency notification to create
     * @param hospital The hospital creating the notification
     * @return The created emergency notification
     */
    EmergencyNotification createHospitalNotification(EmergencyNotification notification, Hospital hospital);
    
    /**
     * Update the status of an emergency notification
     * 
     * @param id The ID of the emergency notification to update
     * @param status The new status
     * @return The updated emergency notification if found, otherwise empty Optional
     */
    Optional<EmergencyNotification> updateNotificationStatus(Long id, String status);
    
    /**
     * Mark expired notifications as EXPIRED
     * 
     * @return The number of notifications marked as expired
     */
    int markExpiredNotifications();
    
    /**
     * Delete an emergency notification
     * 
     * @param id The ID of the emergency notification to delete
     */
    void deleteNotification(Long id);
}