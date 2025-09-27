package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_requests")
public class BloodRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(nullable = false)
    private String phone;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String reason;

    @Column(name = "request_status")
    private String requestStatus = "PENDING"; // PENDING, FULFILLED, CANCELLED, PARTIAL
    
    @Column(name = "units_needed")
    private Integer unitsNeeded = 1;
    
    @Column(name = "units_provided")
    private Integer unitsProvided = 0;
    
    @Column(name = "priority")
    private String priority = "NORMAL"; // EMERGENCY, URGENT, NORMAL, LOW
    
    @Column(name = "required_by")
    private LocalDateTime requiredBy;
    
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "hospital_id")
    private Hospital hospital;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor
    public BloodRequest() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getRequestStatus() {
        return requestStatus;
    }

    public void setRequestStatus(String requestStatus) {
        this.requestStatus = requestStatus;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public Integer getUnitsNeeded() {
        return unitsNeeded;
    }

    public void setUnitsNeeded(Integer unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public Integer getUnitsProvided() {
        return unitsProvided;
    }

    public void setUnitsProvided(Integer unitsProvided) {
        this.unitsProvided = unitsProvided;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public LocalDateTime getRequiredBy() {
        return requiredBy;
    }

    public void setRequiredBy(LocalDateTime requiredBy) {
        this.requiredBy = requiredBy;
    }

    public Hospital getHospital() {
        return hospital;
    }

    public void setHospital(Hospital hospital) {
        this.hospital = hospital;
    }

    @Override
    public String toString() {
        return "BloodRequest{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", location='" + location + '\'' +
                ", reason='" + reason + '\'' +
                ", requestStatus='" + requestStatus + '\'' +
                ", unitsNeeded=" + unitsNeeded +
                ", unitsProvided=" + unitsProvided +
                ", priority='" + priority + '\'' +
                ", requiredBy=" + requiredBy +
                ", hospital=" + (hospital != null ? hospital.getId() : null) +
                '}';
    }
}