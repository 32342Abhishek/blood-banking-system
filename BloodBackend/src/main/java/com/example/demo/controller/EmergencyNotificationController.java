package com.example.demo.controller;

import com.example.demo.model.EmergencyNotification;
import com.example.demo.model.Hospital;
import com.example.demo.service.EmergencyNotificationService;
import com.example.demo.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/emergency-notifications")
@CrossOrigin(origins = "*")
public class EmergencyNotificationController {

    private final EmergencyNotificationService notificationService;
    private final HospitalService hospitalService;

    @Autowired
    public EmergencyNotificationController(EmergencyNotificationService notificationService, HospitalService hospitalService) {
        this.notificationService = notificationService;
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<EmergencyNotification>> getAllNotifications() {
        List<EmergencyNotification> notifications = notificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/active")
    public ResponseEntity<List<EmergencyNotification>> getActiveNotifications() {
        List<EmergencyNotification> notifications = notificationService.getActiveNotifications();
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/active/blood-type/{bloodType}")
    public ResponseEntity<List<EmergencyNotification>> getActiveNotificationsByBloodType(@PathVariable String bloodType) {
        List<EmergencyNotification> notifications = notificationService.getActiveNotificationsByBloodType(bloodType);
        return ResponseEntity.ok(notifications);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getNotificationById(@PathVariable Long id) {
        Optional<EmergencyNotification> notification = notificationService.getNotificationById(id);
        
        if (notification.isPresent()) {
            return ResponseEntity.ok(notification.get());
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification not found with id: " + id);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<EmergencyNotification>> getNotificationsByHospital(@PathVariable Long hospitalId) {
        List<EmergencyNotification> notifications = notificationService.getNotificationsByHospital(hospitalId);
        return ResponseEntity.ok(notifications);
    }

    @PostMapping
    public ResponseEntity<?> createNotification(@RequestBody EmergencyNotification notification) {
        try {
            EmergencyNotification savedNotification = notificationService.saveNotification(notification);
            return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating notification: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/hospital/{hospitalId}")
    public ResponseEntity<?> createHospitalNotification(@PathVariable Long hospitalId, @RequestBody EmergencyNotification notification) {
        try {
            Optional<Hospital> hospital = hospitalService.getHospitalById(hospitalId);
            
            if (!hospital.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Hospital not found with id: " + hospitalId);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            EmergencyNotification savedNotification = notificationService.createHospitalNotification(notification, hospital.get());
            return new ResponseEntity<>(savedNotification, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating notification: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotification(@PathVariable Long id, @RequestBody EmergencyNotification notificationDetails) {
        try {
            Optional<EmergencyNotification> optionalNotification = notificationService.getNotificationById(id);
            
            if (!optionalNotification.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Notification not found with id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            EmergencyNotification notification = optionalNotification.get();
            notification.setTitle(notificationDetails.getTitle());
            notification.setMessage(notificationDetails.getMessage());
            notification.setBloodType(notificationDetails.getBloodType());
            notification.setUnitsNeeded(notificationDetails.getUnitsNeeded());
            notification.setHospitalName(notificationDetails.getHospitalName());
            notification.setLocation(notificationDetails.getLocation());
            notification.setContactPhone(notificationDetails.getContactPhone());
            notification.setContactEmail(notificationDetails.getContactEmail());
            notification.setStatus(notificationDetails.getStatus());
            notification.setExpiryDate(notificationDetails.getExpiryDate());
            
            EmergencyNotification updatedNotification = notificationService.saveNotification(notification);
            return ResponseEntity.ok(updatedNotification);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating notification: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateNotificationStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Optional<EmergencyNotification> updatedNotification = notificationService.updateNotificationStatus(id, status);
            
            if (updatedNotification.isPresent()) {
                return ResponseEntity.ok(updatedNotification.get());
            } else {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Notification not found with id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating notification status: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            Optional<EmergencyNotification> notification = notificationService.getNotificationById(id);
            
            if (!notification.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Notification not found with id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            notificationService.deleteNotification(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Notification deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting notification: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}