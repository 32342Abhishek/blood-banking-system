package com.example.demo.dto;

public class DonorRegistrationRequest {
    
    private String name;
    private String location;
    private String phone;
    private String bloodGroup;
    private String username;
    private String password;
    private String email;
    private Long hospitalId;

    // Constructors
    public DonorRegistrationRequest() {
    }

    public DonorRegistrationRequest(String name, String location, String phone, String bloodGroup, 
                                     String username, String password, String email, Long hospitalId) {
        this.name = name;
        this.location = location;
        this.phone = phone;
        this.bloodGroup = bloodGroup;
        this.username = username;
        this.password = password;
        this.email = email;
        this.hospitalId = hospitalId;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getBloodGroup() {
        return bloodGroup;
    }

    public void setBloodGroup(String bloodGroup) {
        this.bloodGroup = bloodGroup;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getHospitalId() {
        return hospitalId;
    }

    public void setHospitalId(Long hospitalId) {
        this.hospitalId = hospitalId;
    }
}
