package com.example.demo.util;

import com.example.demo.model.*;
import com.example.demo.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.*;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * Utility class for importing and exporting data to/from CSV files
 * and generating sample data for the blood banking system
 */
@Component
public class DataImportExportUtil {

    private static final String CSV_DELIMITER = ",";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    
    private final DonorService donorService;
    private final BloodDonationService bloodDonationService;
    private final BloodInventoryService bloodInventoryService;
    private final BloodRequestService bloodRequestService;
    private final DonationAppointmentService appointmentService;
    private final HospitalService hospitalService;
    private final EmergencyNotificationService notificationService;
    private final UserService userService;
    
    @Autowired
    public DataImportExportUtil(
            DonorService donorService, 
            BloodDonationService bloodDonationService,
            BloodInventoryService bloodInventoryService,
            BloodRequestService bloodRequestService,
            DonationAppointmentService appointmentService,
            HospitalService hospitalService,
            EmergencyNotificationService notificationService,
            UserService userService) {
        this.donorService = donorService;
        this.bloodDonationService = bloodDonationService;
        this.bloodInventoryService = bloodInventoryService;
        this.bloodRequestService = bloodRequestService;
        this.appointmentService = appointmentService;
        this.hospitalService = hospitalService;
        this.notificationService = notificationService;
        this.userService = userService;
    }
    
    /**
     * Import donors from a CSV file
     * 
     * @param csvFile The file containing donor data
     * @return The number of records imported
     */
    public int importDonorsFromCsv(File csvFile) throws IOException {
        int recordsImported = 0;
        
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] data = line.split(CSV_DELIMITER);
                if (data.length >= 8) { // At least 8 columns expected
                    Donor donor = new Donor();
                    donor.setName(data[0].trim());
                    donor.setLocation(data[1].trim());
                    donor.setPhone(data[2].trim());
                    donor.setBloodGroup(data[3].trim());
                    donor.setUsername(data[4].trim());
                    donor.setEmail(data[5].trim());
                    donor.setPassword(data[6].trim());
                    donor.setAvailable("true".equalsIgnoreCase(data[7].trim()));
                    
                    if (data.length > 8 && !data[8].trim().isEmpty()) {
                        donor.setLastDonation(LocalDateTime.parse(data[8].trim(), DATE_FORMATTER));
                    }
                    
                    donorService.saveDonor(donor);
                    recordsImported++;
                }
            }
        }
        
        return recordsImported;
    }
    
    /**
     * Import blood donations from a CSV file
     * 
     * @param csvFile The file containing blood donation data
     * @return The number of records imported
     */
    public int importBloodDonationsFromCsv(File csvFile) throws IOException {
        int recordsImported = 0;
        
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] data = line.split(CSV_DELIMITER);
                if (data.length >= 6) { // At least 6 columns expected
                    Long donorId = Long.parseLong(data[0].trim());
                    Optional<Donor> donorOpt = donorService.getDonorById(donorId);
                    
                    if (donorOpt.isPresent()) {
                        BloodDonation donation = new BloodDonation();
                        donation.setDonor(donorOpt.get());
                        donation.setBloodGroup(data[1].trim());
                        donation.setQuantityMl(Integer.parseInt(data[2].trim()));
                        donation.setDonationDate(LocalDateTime.parse(data[3].trim(), DATE_FORMATTER));
                        donation.setHealthStatus(data[4].trim());
                        donation.setNotes(data[5].trim());
                        
                        if (data.length > 6 && !data[6].trim().isEmpty()) {
                            donation.setHemoglobinLevel(Double.parseDouble(data[6].trim()));
                        }
                        
                        if (data.length > 7 && !data[7].trim().isEmpty()) {
                            donation.setBloodPressure(data[7].trim());
                        }
                        
                        if (data.length > 8 && !data[8].trim().isEmpty()) {
                            donation.setPulseRate(Integer.parseInt(data[8].trim()));
                        }
                        
                        if (data.length > 9 && !data[9].trim().isEmpty()) {
                            donation.setTemperature(Double.parseDouble(data[9].trim()));
                        }
                        
                        bloodDonationService.saveBloodDonation(donation);
                        recordsImported++;
                    }
                }
            }
        }
        
        return recordsImported;
    }
    
    /**
     * Import blood inventory from a CSV file
     * 
     * @param csvFile The file containing blood inventory data
     * @return The number of records imported
     */
    public int importBloodInventoryFromCsv(File csvFile) throws IOException {
        int recordsImported = 0;
        
        try (BufferedReader reader = new BufferedReader(new FileReader(csvFile))) {
            String line;
            boolean isFirstLine = true;
            
            while ((line = reader.readLine()) != null) {
                // Skip header line
                if (isFirstLine) {
                    isFirstLine = false;
                    continue;
                }
                
                String[] data = line.split(CSV_DELIMITER);
                if (data.length >= 5) { // At least 5 columns expected
                    BloodInventory inventory = new BloodInventory();
                    inventory.setBloodGroup(data[0].trim());
                    inventory.setUnits(Integer.parseInt(data[1].trim()));
                    inventory.setStatus(data[2].trim());
                    inventory.setCreatedAt(LocalDateTime.parse(data[3].trim(), DATE_FORMATTER));
                    inventory.setExpiryDate(LocalDateTime.parse(data[4].trim(), DATE_FORMATTER));
                    
                    if (data.length > 5 && !data[5].trim().isEmpty()) {
                        inventory.setDonationId(Long.parseLong(data[5].trim()));
                    }
                    
                    bloodInventoryService.saveBloodInventory(inventory);
                    recordsImported++;
                }
            }
        }
        
        return recordsImported;
    }
    
    /**
     * Export donors to a CSV file
     * 
     * @param outputFile The file to export to
     * @return The number of records exported
     */
    public int exportDonorsToCsv(File outputFile) throws IOException {
        List<Donor> donors = donorService.getAllDonors();
        
        try (PrintWriter writer = new PrintWriter(outputFile)) {
            // Write header
            writer.println("Name,Location,Phone,BloodGroup,Username,Email,Password,IsAvailable,LastDonation");
            
            // Write data
            for (Donor donor : donors) {
                StringBuilder line = new StringBuilder();
                line.append(donor.getName()).append(CSV_DELIMITER);
                line.append(donor.getLocation()).append(CSV_DELIMITER);
                line.append(donor.getPhone()).append(CSV_DELIMITER);
                line.append(donor.getBloodGroup()).append(CSV_DELIMITER);
                line.append(donor.getUsername()).append(CSV_DELIMITER);
                line.append(donor.getEmail()).append(CSV_DELIMITER);
                line.append("********").append(CSV_DELIMITER); // Don't export actual passwords
                line.append(donor.isAvailable()).append(CSV_DELIMITER);
                line.append(donor.getLastDonation() != null ? donor.getLastDonation().format(DATE_FORMATTER) : "");
                
                writer.println(line.toString());
            }
        }
        
        return donors.size();
    }
    
    /**
     * Export blood donations to a CSV file
     * 
     * @param outputFile The file to export to
     * @return The number of records exported
     */
    public int exportBloodDonationsToCsv(File outputFile) throws IOException {
        List<BloodDonation> donations = bloodDonationService.getAllBloodDonations();
        
        try (PrintWriter writer = new PrintWriter(outputFile)) {
            // Write header
            writer.println("DonorId,BloodGroup,QuantityMl,DonationDate,HealthStatus,Notes,HemoglobinLevel,BloodPressure,PulseRate,Temperature");
            
            // Write data
            for (BloodDonation donation : donations) {
                StringBuilder line = new StringBuilder();
                line.append(donation.getDonor().getId()).append(CSV_DELIMITER);
                line.append(donation.getBloodGroup()).append(CSV_DELIMITER);
                line.append(donation.getQuantityMl()).append(CSV_DELIMITER);
                line.append(donation.getDonationDate().format(DATE_FORMATTER)).append(CSV_DELIMITER);
                line.append(donation.getHealthStatus()).append(CSV_DELIMITER);
                line.append(donation.getNotes() != null ? donation.getNotes().replace(",", ";") : "").append(CSV_DELIMITER);
                line.append(donation.getHemoglobinLevel() != null ? donation.getHemoglobinLevel() : "").append(CSV_DELIMITER);
                line.append(donation.getBloodPressure() != null ? donation.getBloodPressure() : "").append(CSV_DELIMITER);
                line.append(donation.getPulseRate() != null ? donation.getPulseRate() : "").append(CSV_DELIMITER);
                line.append(donation.getTemperature() != null ? donation.getTemperature() : "");
                
                writer.println(line.toString());
            }
        }
        
        return donations.size();
    }
    
    /**
     * Generate sample data for testing purposes
     */
    public void generateSampleData(int numberOfDonors, int numberOfDonations, int numberOfHospitals) {
        // Sample blood groups
        String[] bloodGroups = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};
        
        // Sample locations
        String[] locations = {"New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"};
        
        // Generate sample donors
        List<Donor> donors = new ArrayList<>();
        for (int i = 0; i < numberOfDonors; i++) {
            Donor donor = new Donor();
            donor.setName("Donor " + (i + 1));
            donor.setLocation(locations[i % locations.length]);
            donor.setPhone("555-" + String.format("%03d", i) + "-" + String.format("%04d", 1000 + i));
            donor.setBloodGroup(bloodGroups[i % bloodGroups.length]);
            donor.setUsername("donor" + (i + 1));
            donor.setEmail("donor" + (i + 1) + "@example.com");
            donor.setPassword("password" + (i + 1));
            donor.setAvailable(i % 5 != 0); // Make some donors unavailable
            
            // Set last donation date for some donors
            if (i % 3 == 0) {
                donor.setLastDonation(LocalDateTime.now().minusDays(30 + (i % 60)));
            }
            
            donors.add(donorService.saveDonor(donor));
        }
        
        // Generate sample hospitals
        List<Hospital> hospitals = new ArrayList<>();
        for (int i = 0; i < numberOfHospitals; i++) {
            Hospital hospital = new Hospital();
            hospital.setName("Hospital " + (i + 1));
            hospital.setAddress(locations[i % locations.length]);
            hospital.setContactPerson("Doctor " + (i + 1));
            hospital.setPhone("555-" + String.format("%03d", 500 + i) + "-" + String.format("%04d", 2000 + i));
            hospital.setEmail("hospital" + (i + 1) + "@example.com");
            
            hospitals.add(hospitalService.saveHospital(hospital));
        }
        
        // Generate sample blood donations
        Random random = new Random();
        for (int i = 0; i < numberOfDonations; i++) {
            Donor donor = donors.get(random.nextInt(donors.size()));
            
            // Create donation
            BloodDonation donation = new BloodDonation();
            donation.setDonor(donor);
            donation.setBloodGroup(donor.getBloodGroup());
            donation.setQuantityMl(400 + random.nextInt(100)); // Between 400 and 500 ml
            donation.setDonationDate(LocalDateTime.now().minusDays(random.nextInt(90)));
            donation.setHealthStatus(random.nextInt(10) < 9 ? "NORMAL" : "ABNORMAL"); // 90% are normal
            donation.setNotes("Sample donation notes for donation " + (i + 1));
            donation.setHemoglobinLevel(12.0 + random.nextDouble() * 6); // Between 12 and 18
            donation.setBloodPressure(String.format("%d/%d", 110 + random.nextInt(30), 70 + random.nextInt(20)));
            donation.setPulseRate(60 + random.nextInt(40)); // Between 60 and 100
            donation.setTemperature(36.0 + random.nextDouble() * 2); // Between 36 and 38
            
            bloodDonationService.saveBloodDonation(donation);
            
            // Update donor's last donation date
            donor.setLastDonation(donation.getDonationDate());
            donorService.saveDonor(donor);
            
            // Create inventory entry for healthy donations
            if ("NORMAL".equals(donation.getHealthStatus())) {
                BloodInventory inventory = new BloodInventory();
                inventory.setBloodGroup(donation.getBloodGroup());
                inventory.setUnits(donation.getQuantityMl() / 450); // Standard blood unit is about 450ml
                inventory.setStatus("AVAILABLE");
                inventory.setCreatedAt(donation.getDonationDate());
                inventory.setExpiryDate(donation.getDonationDate().plusDays(42)); // Blood typically expires in 42 days
                inventory.setDonationId(donation.getId());
                
                bloodInventoryService.saveBloodInventory(inventory);
            }
        }
        
        // Generate sample blood requests
        for (int i = 0; i < numberOfDonations / 3; i++) { // Create fewer requests than donations
            Hospital hospital = hospitals.get(random.nextInt(hospitals.size()));
            String bloodGroup = bloodGroups[random.nextInt(bloodGroups.length)];
            
            BloodRequest request = new BloodRequest();
            request.setCreatedAt(LocalDateTime.now().minusDays(random.nextInt(30)));
            request.setHospital(hospital);
            request.setBloodGroup(bloodGroup);
            request.setUnitsNeeded(1 + random.nextInt(3)); // Between 1 and 3 units
            request.setPriority(random.nextInt(10) < 3 ? "HIGH" : (random.nextInt(10) < 7 ? "MEDIUM" : "LOW"));
            request.setName("Patient " + (i + 1));
            request.setRequestStatus(random.nextInt(10) < 7 ? "FULFILLED" : (random.nextInt(10) < 5 ? "PENDING" : "CANCELLED"));
            // Set required fields that are marked as non-nullable
            request.setPhone("555-" + String.format("%03d", 100 + i) + "-" + String.format("%04d", 1000 + i));
            request.setEmail("patient" + (i + 1) + "@example.com");
            request.setLocation(locations[i % locations.length]);
            request.setReason("Medical treatment");
            
            bloodRequestService.saveBloodRequest(request);
        }
        
        // Generate sample appointments
        for (int i = 0; i < numberOfDonors / 2; i++) { // Half of donors have appointments
            Donor donor = donors.get(random.nextInt(donors.size()));
            
            DonationAppointment appointment = new DonationAppointment();
            appointment.setDonor(donor); // Set the entire donor object instead of individual fields
            appointment.setAppointmentDate(LocalDateTime.now().plusDays(1 + random.nextInt(14))); // Next 2 weeks
            appointment.setStatus(random.nextInt(10) < 7 ? "SCHEDULED" : (random.nextInt(10) < 5 ? "COMPLETED" : "CANCELLED"));
            appointment.setNotes("Sample appointment notes");
            
            appointmentService.saveAppointment(appointment);
        }
        
        // Generate sample emergency notifications
        for (int i = 0; i < numberOfHospitals; i++) {
            Hospital hospital = hospitals.get(i % hospitals.size());
            String bloodGroup = bloodGroups[random.nextInt(bloodGroups.length)];
            
            EmergencyNotification notification = new EmergencyNotification();
            notification.setHospital(hospital);
            notification.setBloodType(bloodGroup);
            notification.setUnitsNeeded(1 + random.nextInt(5)); // Between 1 and 5 units
            notification.setTitle("Emergency: " + bloodGroup + " Blood Needed");
            notification.setMessage("Urgent need for " + bloodGroup + " blood at " + hospital.getName());
            notification.setLocation(hospital.getAddress()); // Set the location from hospital's address
            notification.setStatus(i < numberOfHospitals / 3 ? "ACTIVE" : "FULFILLED"); // Only some are active
            notification.setCreatedAt(LocalDateTime.now().minusDays(i < numberOfHospitals / 3 ? 1 : 5 + random.nextInt(10)));
            
            notificationService.saveNotification(notification);
        }
    }
}