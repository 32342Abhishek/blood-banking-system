package com.example.demo.service;

import com.example.demo.model.EmergencyNotification;
import com.example.demo.model.Hospital;
import com.example.demo.repository.EmergencyNotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class EmergencyNotificationServiceImpl implements EmergencyNotificationService {

    private final EmergencyNotificationRepository notificationRepository;

    @Autowired
    public EmergencyNotificationServiceImpl(EmergencyNotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public EmergencyNotification saveNotification(EmergencyNotification notification) {
        if (notification.getId() == null) {
            notification.setCreatedAt(LocalDateTime.now());
        }
        notification.setUpdatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    @Override
    public Optional<EmergencyNotification> getNotificationById(Long id) {
        return notificationRepository.findById(id);
    }

    @Override
    public List<EmergencyNotification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @Override
    public List<EmergencyNotification> getActiveNotifications() {
        return notificationRepository.findActiveNotifications(LocalDateTime.now());
    }

    @Override
    public List<EmergencyNotification> getActiveNotificationsByBloodType(String bloodType) {
        return notificationRepository.findActiveNotificationsByBloodType(LocalDateTime.now(), bloodType);
    }

    @Override
    public List<EmergencyNotification> getNotificationsByHospital(Long hospitalId) {
        return notificationRepository.findByHospital_Id(hospitalId);
    }

    @Override
    public EmergencyNotification createHospitalNotification(EmergencyNotification notification, Hospital hospital) {
        notification.setHospital(hospital);
        
        if (notification.getHospitalName() == null) {
            notification.setHospitalName(hospital.getName());
        }
        
        if (notification.getContactEmail() == null) {
            notification.setContactEmail(hospital.getEmail());
        }
        
        if (notification.getContactPhone() == null) {
            notification.setContactPhone(hospital.getPhone());
        }
        
        if (notification.getLocation() == null) {
            notification.setLocation(hospital.getAddress());
        }
        
        return saveNotification(notification);
    }

    @Override
    public Optional<EmergencyNotification> updateNotificationStatus(Long id, String status) {
        Optional<EmergencyNotification> notificationOpt = notificationRepository.findById(id);
        
        if (notificationOpt.isPresent()) {
            EmergencyNotification notification = notificationOpt.get();
            notification.setStatus(status);
            notification.setUpdatedAt(LocalDateTime.now());
            return Optional.of(notificationRepository.save(notification));
        }
        
        return Optional.empty();
    }

    @Override
    @Scheduled(fixedRate = 3600000) // Run every hour
    public int markExpiredNotifications() {
        List<EmergencyNotification> expiredNotifications = notificationRepository.findExpiredNotifications(LocalDateTime.now());
        
        for (EmergencyNotification notification : expiredNotifications) {
            notification.setStatus("EXPIRED");
            notification.setUpdatedAt(LocalDateTime.now());
            notificationRepository.save(notification);
        }
        
        return expiredNotifications.size();
    }

    @Override
    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }
}