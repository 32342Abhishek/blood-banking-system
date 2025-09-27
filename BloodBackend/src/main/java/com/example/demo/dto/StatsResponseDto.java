package com.example.demo.dto;

import java.util.List;

/**
 * Data Transfer Object for system statistics
 */
public class StatsResponseDto {
    private int totalDonors;
    private int totalDonations;
    private int totalBloodRequests;
    private int totalInventory;
    private int totalHospitals;
    private int totalAppointments;
    private int activeEmergencyNotifications;
    private int upcomingAppointments;
    private List<String> criticalBloodGroups;

    public StatsResponseDto() {
    }

    public int getTotalDonors() {
        return totalDonors;
    }

    public void setTotalDonors(int totalDonors) {
        this.totalDonors = totalDonors;
    }

    public int getTotalDonations() {
        return totalDonations;
    }

    public void setTotalDonations(int totalDonations) {
        this.totalDonations = totalDonations;
    }

    public int getTotalBloodRequests() {
        return totalBloodRequests;
    }

    public void setTotalBloodRequests(int totalBloodRequests) {
        this.totalBloodRequests = totalBloodRequests;
    }

    public int getTotalInventory() {
        return totalInventory;
    }

    public void setTotalInventory(int totalInventory) {
        this.totalInventory = totalInventory;
    }

    public int getTotalHospitals() {
        return totalHospitals;
    }

    public void setTotalHospitals(int totalHospitals) {
        this.totalHospitals = totalHospitals;
    }

    public int getTotalAppointments() {
        return totalAppointments;
    }

    public void setTotalAppointments(int totalAppointments) {
        this.totalAppointments = totalAppointments;
    }

    public int getActiveEmergencyNotifications() {
        return activeEmergencyNotifications;
    }

    public void setActiveEmergencyNotifications(int activeEmergencyNotifications) {
        this.activeEmergencyNotifications = activeEmergencyNotifications;
    }

    public int getUpcomingAppointments() {
        return upcomingAppointments;
    }

    public void setUpcomingAppointments(int upcomingAppointments) {
        this.upcomingAppointments = upcomingAppointments;
    }

    public List<String> getCriticalBloodGroups() {
        return criticalBloodGroups;
    }

    public void setCriticalBloodGroups(List<String> criticalBloodGroups) {
        this.criticalBloodGroups = criticalBloodGroups;
    }
}