package com.example.demo.service;

import com.example.demo.dto.StatsResponseDto;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Implementation of DatabaseStatsService
 */
@Service
public class DatabaseStatsServiceImpl implements DatabaseStatsService {

    private final DonorRepository donorRepository;
    private final BloodDonationRepository donationRepository;
    private final BloodInventoryRepository inventoryRepository;
    private final BloodRequestRepository requestRepository;
    private final DonationAppointmentRepository appointmentRepository;
    private final EmergencyNotificationRepository notificationRepository;
    private final HospitalRepository hospitalRepository;
    
    @Autowired
    public DatabaseStatsServiceImpl(
            DonorRepository donorRepository,
            BloodDonationRepository donationRepository,
            BloodInventoryRepository inventoryRepository,
            BloodRequestRepository requestRepository,
            DonationAppointmentRepository appointmentRepository,
            EmergencyNotificationRepository notificationRepository,
            HospitalRepository hospitalRepository) {
        this.donorRepository = donorRepository;
        this.donationRepository = donationRepository;
        this.inventoryRepository = inventoryRepository;
        this.requestRepository = requestRepository;
        this.appointmentRepository = appointmentRepository;
        this.notificationRepository = notificationRepository;
        this.hospitalRepository = hospitalRepository;
    }
    
    @Override
    public Map<String, Object> getDonorStats() {
        Map<String, Object> stats = new HashMap<>();
        List<Donor> donors = donorRepository.findAll();
        
        stats.put("totalDonors", donors.size());
        stats.put("activeDonors", donors.stream().filter(Donor::isAvailable).count());
        stats.put("inactiveDonors", donors.stream().filter(d -> !d.isAvailable()).count());
        
        // Donors by blood group
        stats.put("donorsByBloodGroup", getBloodGroupDistribution());
        
        // Donors by location
        stats.put("donorsByLocation", getDonorLocationDistribution());
        
        // Recent donors (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentDonors = donors.stream()
                .filter(d -> d.getLastDonation() != null && d.getLastDonation().isAfter(thirtyDaysAgo))
                .count();
        stats.put("recentDonors", recentDonors);
        
        // Eligible donors (haven't donated in last 56 days)
        LocalDateTime fiftyDaysAgo = LocalDateTime.now().minusDays(56);
        long eligibleDonors = donors.stream()
                .filter(d -> d.getLastDonation() == null || d.getLastDonation().isBefore(fiftyDaysAgo))
                .count();
        stats.put("eligibleDonors", eligibleDonors);
        
        return stats;
    }
    
    @Override
    public Map<String, Object> getDonationStats() {
        Map<String, Object> stats = new HashMap<>();
        List<BloodDonation> donations = donationRepository.findAll();
        
        stats.put("totalDonations", donations.size());
        
        // Donations by blood group
        Map<String, Long> donationsByBloodGroup = donations.stream()
                .collect(Collectors.groupingBy(BloodDonation::getBloodGroup, Collectors.counting()));
        stats.put("donationsByBloodGroup", donationsByBloodGroup);
        
        // Donations by health status
        Map<String, Long> donationsByHealthStatus = donations.stream()
                .collect(Collectors.groupingBy(
                    d -> d.getHealthStatus() != null ? d.getHealthStatus() : "UNKNOWN",
                    Collectors.counting()
                ));
        stats.put("donationsByHealthStatus", donationsByHealthStatus);
        
        // Recent donations (last 30 days)
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        long recentDonations = donations.stream()
                .filter(d -> d.getDonationDate().isAfter(thirtyDaysAgo))
                .count();
        stats.put("recentDonations", recentDonations);
        
        // Total blood volume donated (in ml)
        int totalVolume = donations.stream()
                .mapToInt(BloodDonation::getQuantityMl)
                .sum();
        stats.put("totalBloodVolumeMl", totalVolume);
        
        // Average donation volume
        double avgVolume = donations.stream()
                .mapToInt(BloodDonation::getQuantityMl)
                .average()
                .orElse(0);
        stats.put("averageDonationVolumeMl", avgVolume);
        
        // Monthly donation trends (last 6 months)
        Map<String, Long> monthlyTrends = new HashMap<>();
        for (int i = 5; i >= 0; i--) {
            LocalDateTime startOfMonth = LocalDateTime.now().minusMonths(i).withDayOfMonth(1).truncatedTo(ChronoUnit.DAYS);
            LocalDateTime startOfNextMonth = startOfMonth.plusMonths(1);
            
            String monthYear = startOfMonth.getMonth() + " " + startOfMonth.getYear();
            long count = donations.stream()
                    .filter(d -> d.getDonationDate().isAfter(startOfMonth) && d.getDonationDate().isBefore(startOfNextMonth))
                    .count();
            
            monthlyTrends.put(monthYear, count);
        }
        stats.put("monthlyTrends", monthlyTrends);
        
        return stats;
    }
    
    @Override
    public Map<String, Object> getInventoryStats() {
        Map<String, Object> stats = new HashMap<>();
        List<BloodInventory> inventory = inventoryRepository.findAll();
        
        stats.put("totalInventoryItems", inventory.size());
        
        // Available units by blood group
        Map<String, Integer> availableUnitsByBloodGroup = new HashMap<>();
        inventory.stream()
                .filter(i -> "AVAILABLE".equals(i.getStatus()))
                .forEach(i -> {
                    String bloodGroup = i.getBloodGroup();
                    availableUnitsByBloodGroup.put(bloodGroup, 
                            availableUnitsByBloodGroup.getOrDefault(bloodGroup, 0) + i.getUnits());
                });
        stats.put("availableUnitsByBloodGroup", availableUnitsByBloodGroup);
        
        // Total available units
        int totalAvailableUnits = availableUnitsByBloodGroup.values().stream().mapToInt(Integer::intValue).sum();
        stats.put("totalAvailableUnits", totalAvailableUnits);
        
        // Units by status
        Map<String, Integer> unitsByStatus = new HashMap<>();
        inventory.forEach(i -> {
            String status = i.getStatus();
            unitsByStatus.put(status, unitsByStatus.getOrDefault(status, 0) + i.getUnits());
        });
        stats.put("unitsByStatus", unitsByStatus);
        
        // Expiring soon (next 7 days)
        LocalDateTime sevenDaysLater = LocalDateTime.now().plusDays(7);
        int expiringSoon = inventory.stream()
                .filter(i -> "AVAILABLE".equals(i.getStatus()))
                .filter(i -> i.getExpiryDate().isBefore(sevenDaysLater))
                .mapToInt(BloodInventory::getUnits)
                .sum();
        stats.put("unitExpiringNextWeek", expiringSoon);
        
        return stats;
    }
    
    @Override
    public Map<String, Object> getRequestStats() {
        Map<String, Object> stats = new HashMap<>();
        List<BloodRequest> requests = requestRepository.findAll();
        
        stats.put("totalRequests", requests.size());
        
        // Requests by status
        Map<String, Long> requestsByStatus = requests.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getRequestStatus() != null ? r.getRequestStatus() : "UNKNOWN",
                    Collectors.counting()
                ));
        stats.put("requestsByStatus", requestsByStatus);
        
        // Requests by blood group
        Map<String, Long> requestsByBloodGroup = requests.stream()
                .collect(Collectors.groupingBy(BloodRequest::getBloodGroup, Collectors.counting()));
        stats.put("requestsByBloodGroup", requestsByBloodGroup);
        
        // Requests by priority
        Map<String, Long> requestsByPriority = requests.stream()
                .collect(Collectors.groupingBy(
                    r -> r.getPriority() != null ? r.getPriority() : "UNKNOWN",
                    Collectors.counting()
                ));
        stats.put("requestsByPriority", requestsByPriority);
        
        // Recent requests (last 7 days)
        LocalDateTime sevenDaysAgo = LocalDateTime.now().minusDays(7);
        long recentRequests = requests.stream()
                .filter(r -> r.getCreatedAt().isAfter(sevenDaysAgo))
                .count();
        stats.put("recentRequests", recentRequests);
        
        // Total units requested
        int totalUnits = requests.stream()
                .mapToInt(BloodRequest::getUnitsNeeded)
                .sum();
        stats.put("totalUnitsRequested", totalUnits);
        
        return stats;
    }
    
    @Override
    public Map<String, Object> getOverallStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Include high level stats from other methods
        stats.put("totalDonors", donorRepository.count());
        stats.put("totalDonations", donationRepository.count());
        stats.put("totalBloodRequests", requestRepository.count());
        stats.put("totalHospitals", hospitalRepository.count());
        stats.put("totalAppointments", appointmentRepository.count());
        
        // Get active emergency notifications
        LocalDateTime now = LocalDateTime.now();
        long activeNotifications = notificationRepository.findActiveNotifications(now).size();
        stats.put("activeEmergencyNotifications", activeNotifications);
        
        // Calculate blood inventory levels
        Map<String, Integer> inventoryLevels = new HashMap<>();
        inventoryRepository.findAll().stream()
                .filter(i -> "AVAILABLE".equals(i.getStatus()))
                .forEach(i -> {
                    String bloodGroup = i.getBloodGroup();
                    inventoryLevels.put(bloodGroup, 
                            inventoryLevels.getOrDefault(bloodGroup, 0) + i.getUnits());
                });
        
        // Check for critical inventory levels (less than 3 units)
        List<String> criticalGroups = new ArrayList<>();
        inventoryLevels.forEach((group, units) -> {
            if (units < 3) {
                criticalGroups.add(group);
            }
        });
        stats.put("criticalBloodGroups", criticalGroups);
        
        // Get scheduled appointments for next week
        LocalDateTime nextWeek = LocalDateTime.now().plusDays(7);
        long upcomingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "SCHEDULED".equals(a.getStatus()))
                .filter(a -> a.getAppointmentDate().isBefore(nextWeek))
                .count();
        stats.put("upcomingAppointments", upcomingAppointments);
        
        return stats;
    }
    
    @Override
    public Map<String, Integer> getBloodGroupDistribution() {
        Map<String, Integer> distribution = new HashMap<>();
        donorRepository.findAll().forEach(donor -> {
            String bloodGroup = donor.getBloodGroup();
            distribution.put(bloodGroup, distribution.getOrDefault(bloodGroup, 0) + 1);
        });
        return distribution;
    }
    
    @Override
    public Map<String, Integer> getDonorLocationDistribution() {
        Map<String, Integer> distribution = new HashMap<>();
        donorRepository.findAll().forEach(donor -> {
            String location = donor.getLocation();
            distribution.put(location, distribution.getOrDefault(location, 0) + 1);
        });
        return distribution;
    }
    
    @Override
    public StatsResponseDto getSystemStats() {
        StatsResponseDto statsDto = new StatsResponseDto();
        
        // Get basic counts
        statsDto.setTotalDonors((int) donorRepository.count());
        statsDto.setTotalDonations((int) donationRepository.count());
        statsDto.setTotalBloodRequests((int) requestRepository.count());
        statsDto.setTotalHospitals((int) hospitalRepository.count());
        statsDto.setTotalAppointments((int) appointmentRepository.count());
        
        // Calculate inventory total
        int inventoryTotal = 0;
        for (BloodInventory item : inventoryRepository.findAll()) {
            if ("AVAILABLE".equals(item.getStatus())) {
                inventoryTotal += item.getUnits();
            }
        }
        statsDto.setTotalInventory(inventoryTotal);
        
        // Get active emergency notifications
        LocalDateTime now = LocalDateTime.now();
        long activeNotifications = notificationRepository.findActiveNotifications(now).size();
        statsDto.setActiveEmergencyNotifications((int) activeNotifications);
        
        // Calculate critical blood groups (less than 3 units)
        Map<String, Integer> inventoryLevels = new HashMap<>();
        inventoryRepository.findAll().stream()
                .filter(i -> "AVAILABLE".equals(i.getStatus()))
                .forEach(i -> {
                    String bloodGroup = i.getBloodGroup();
                    inventoryLevels.put(bloodGroup, 
                            inventoryLevels.getOrDefault(bloodGroup, 0) + i.getUnits());
                });
        
        List<String> criticalGroups = new ArrayList<>();
        inventoryLevels.forEach((group, units) -> {
            if (units < 3) {
                criticalGroups.add(group);
            }
        });
        statsDto.setCriticalBloodGroups(criticalGroups);
        
        // Get scheduled appointments for next week
        LocalDateTime nextWeek = LocalDateTime.now().plusDays(7);
        long upcomingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "SCHEDULED".equals(a.getStatus()))
                .filter(a -> a.getAppointmentDate().isBefore(nextWeek))
                .count();
        statsDto.setUpcomingAppointments((int) upcomingAppointments);
        
        return statsDto;
    }
}