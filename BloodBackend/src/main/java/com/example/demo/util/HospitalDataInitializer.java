package com.example.demo.util;

import com.example.demo.model.Hospital;
import com.example.demo.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

/**
 * This class initializes sample hospital data when the application starts
 * Only runs if the hospitals table is empty
 */
@Component
public class HospitalDataInitializer implements CommandLineRunner {

    @Autowired
    private HospitalService hospitalService;

    @Override
    public void run(String... args) throws Exception {
        // Check if hospitals already exist
        if (hospitalService.getAllHospitals().isEmpty()) {
            System.out.println("No hospitals found. Initializing sample hospital data...");
            initializeSampleHospitals();
            System.out.println("Sample hospitals added successfully!");
        } else {
            System.out.println("Hospitals already exist in database. Skipping initialization.");
        }
    }

    private void initializeSampleHospitals() {
        // Create sample hospitals
        createHospital("City General Hospital", "123 Main Street, New York, NY 10001", 
                      "Dr. Sarah Johnson", "admin@citygeneralhospital.com", 
                      "+1-212-555-0101", "REG-CGH-2024-001");

        createHospital("St. Mary Medical Center", "456 Oak Avenue, Los Angeles, CA 90001",
                      "Dr. Michael Chen", "info@stmarysmedical.com",
                      "+1-213-555-0202", "REG-SMC-2024-002");

        createHospital("Memorial Hospital", "789 Pine Road, Chicago, IL 60601",
                      "Dr. Emily Davis", "contact@memorialhospital.com",
                      "+1-312-555-0303", "REG-MH-2024-003");

        createHospital("Hope Medical Institute", "321 Elm Street, Houston, TX 77001",
                      "Dr. Robert Wilson", "admin@hopemedical.com",
                      "+1-713-555-0404", "REG-HMI-2024-004");

        createHospital("Central Healthcare Center", "654 Maple Drive, Phoenix, AZ 85001",
                      "Dr. Jennifer Martinez", "info@centralhealthcare.com",
                      "+1-602-555-0505", "REG-CHC-2024-005");

        createHospital("Riverside Hospital", "987 River Lane, Philadelphia, PA 19101",
                      "Dr. David Anderson", "contact@riversidehospital.com",
                      "+1-215-555-0606", "REG-RH-2024-006");

        createHospital("Green Valley Medical Center", "147 Valley Road, San Antonio, TX 78201",
                      "Dr. Lisa Thompson", "admin@greenvalleymedical.com",
                      "+1-210-555-0707", "REG-GVMC-2024-007");

        createHospital("Sunshine Hospital", "258 Sunshine Boulevard, San Diego, CA 92101",
                      "Dr. James White", "info@sunshinehospital.com",
                      "+1-619-555-0808", "REG-SH-2024-008");

        createHospital("Metro Health Systems", "369 Metro Avenue, Dallas, TX 75201",
                      "Dr. Maria Garcia", "contact@metrohealth.com",
                      "+1-214-555-0909", "REG-MHS-2024-009");

        createHospital("Community General Hospital", "741 Community Street, San Jose, CA 95101",
                      "Dr. William Brown", "admin@communitygeneralhospital.com",
                      "+1-408-555-1010", "REG-CGH-2024-010");
    }

    private void createHospital(String name, String address, String contactPerson,
                               String email, String phone, String registrationNumber) {
        Hospital hospital = new Hospital();
        hospital.setName(name);
        hospital.setAddress(address);
        hospital.setContactPerson(contactPerson);
        hospital.setEmail(email);
        hospital.setPhone(phone);
        hospital.setRegistrationNumber(registrationNumber);
        hospital.setStatus("ACTIVE");
        
        try {
            hospitalService.saveHospital(hospital);
            System.out.println("  ✓ Added: " + name);
        } catch (Exception e) {
            System.err.println("  ✗ Failed to add: " + name + " - " + e.getMessage());
        }
    }
}
