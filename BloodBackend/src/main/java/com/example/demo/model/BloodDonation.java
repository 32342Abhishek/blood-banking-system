package com.example.demo.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import java.time.LocalDateTime;

@Entity
@Table(name = "blood_donations")
public class BloodDonation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "donor_id", nullable = false)
    private Donor donor;

    @Column(name = "blood_group", nullable = false)
    private String bloodGroup;

    @Column(name = "quantity_ml", nullable = false)
    private Integer quantityMl;

    @Column(name = "donation_date", nullable = false)
    private LocalDateTime donationDate;

    @Column(name = "health_status")
    private String healthStatus; // NORMAL, ABNORMAL

    @Column(name = "hemoglobin_level")
    private Double hemoglobinLevel;

    @Column(name = "blood_pressure")
    private String bloodPressure;

    @Column(name = "pulse_rate")
    private Integer pulseRate;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "notes")
    private String notes;
    
    @Column(name = "donation_status")
    private String donationStatus = "PENDING";  // PENDING, APPROVED, REJECTED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Default constructor
    public BloodDonation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        this.donationDate = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Donor getDonor() {
        return donor;
    }

    public void setDonor(Donor donor) {
        this.donor = donor;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public Integer getQuantityMl() {
        return quantityMl;
    }

    public void setQuantityMl(Integer quantityMl) {
        this.quantityMl = quantityMl;
    }

    public LocalDateTime getDonationDate() {
        return donationDate;
    }

    public void setDonationDate(LocalDateTime donationDate) {
        this.donationDate = donationDate;
    }

    public String getHealthStatus() {
        return healthStatus;
    }

    public void setHealthStatus(String healthStatus) {
        this.healthStatus = healthStatus;
    }

    public Double getHemoglobinLevel() {
        return hemoglobinLevel;
    }

    public void setHemoglobinLevel(Double hemoglobinLevel) {
        this.hemoglobinLevel = hemoglobinLevel;
    }

    public String getBloodPressure() {
        return bloodPressure;
    }

    public void setBloodPressure(String bloodPressure) {
        this.bloodPressure = bloodPressure;
    }

    public Integer getPulseRate() {
        return pulseRate;
    }

    public void setPulseRate(Integer pulseRate) {
        this.pulseRate = pulseRate;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
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
    
    public String getDonationStatus() {
        return donationStatus;
    }

    public void setDonationStatus(String donationStatus) {
        this.donationStatus = donationStatus;
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public String toString() {
        return "BloodDonation{" +
                "id=" + id +
                ", donor=" + donor.getName() +
                ", bloodGroup='" + bloodGroup + '\'' +
                ", quantityMl=" + quantityMl +
                ", donationDate=" + donationDate +
                ", healthStatus='" + healthStatus + '\'' +
                ", donationStatus='" + donationStatus + '\'' +
                '}';
    }
}