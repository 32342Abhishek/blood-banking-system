package com.example.demo.dto;

public class BloodRequestDTO {
    
    private String name;
    private String bloodGroup;
    private String phone;
    private String email;
    private String location;
    private String reason;
    private Integer unitsNeeded;
    private String priority;
    private Long hospitalId;

    // Constructors
    public BloodRequestDTO() {
    }

    public BloodRequestDTO(String name, String bloodGroup, String phone, String email, 
                           String location, String reason, Integer unitsNeeded, 
                           String priority, Long hospitalId) {
        this.name = name;
        this.bloodGroup = bloodGroup;
        this.phone = phone;
        this.email = email;
        this.location = location;
        this.reason = reason;
        this.unitsNeeded = unitsNeeded;
        this.priority = priority;
        this.hospitalId = hospitalId;
    }

    // Getters and Setters
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

    public Integer getUnitsNeeded() {
        return unitsNeeded;
    }

    public void setUnitsNeeded(Integer unitsNeeded) {
        this.unitsNeeded = unitsNeeded;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}
