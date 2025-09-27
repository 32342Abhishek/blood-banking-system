package com.example.demo.repository;

import com.example.demo.model.EmergencyNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EmergencyNotificationRepository extends JpaRepository<EmergencyNotification, Long> {

    List<EmergencyNotification> findByStatus(String status);
    
    List<EmergencyNotification> findByBloodType(String bloodType);
    
    List<EmergencyNotification> findByHospital_Id(Long hospitalId);
    
    @Query("SELECT e FROM EmergencyNotification e WHERE e.status = 'ACTIVE' AND e.expiryDate > ?1")
    List<EmergencyNotification> findActiveNotifications(LocalDateTime now);
    
    @Query("SELECT e FROM EmergencyNotification e WHERE e.status = 'ACTIVE' AND e.expiryDate > ?1 AND e.bloodType = ?2")
    List<EmergencyNotification> findActiveNotificationsByBloodType(LocalDateTime now, String bloodType);
    
    @Query("SELECT e FROM EmergencyNotification e WHERE e.expiryDate < ?1 AND e.status = 'ACTIVE'")
    List<EmergencyNotification> findExpiredNotifications(LocalDateTime now);
}