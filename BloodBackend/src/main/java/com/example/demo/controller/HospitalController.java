package com.example.demo.controller;

import com.example.demo.model.Hospital;
import com.example.demo.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/hospitals")
@CrossOrigin(origins = "*")
public class HospitalController {

    private final HospitalService hospitalService;

    @Autowired
    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping
    public ResponseEntity<List<Hospital>> getAllHospitals() {
        List<Hospital> hospitals = hospitalService.getAllHospitals();
        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

    @GetMapping("/active")
    public ResponseEntity<List<Hospital>> getActiveHospitals() {
        List<Hospital> hospitals = hospitalService.getActiveHospitals();
        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHospitalById(@PathVariable Long id) {
        Optional<Hospital> hospital = hospitalService.getHospitalById(id);
        
        if (hospital.isPresent()) {
            return new ResponseEntity<>(hospital.get(), HttpStatus.OK);
        } else {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Hospital not found with id: " + id);
            return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
        }
    }

    @PostMapping
    public ResponseEntity<?> createHospital(@RequestBody Hospital hospital) {
        try {
            // Check if hospital with same email already exists
            Optional<Hospital> existingHospital = hospitalService.findByEmail(hospital.getEmail());
            if (existingHospital.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Hospital with this email already exists");
                return new ResponseEntity<>(response, HttpStatus.CONFLICT);
            }
            
            // Check if hospital with same registration number already exists
            if (hospital.getRegistrationNumber() != null) {
                existingHospital = hospitalService.findByRegistrationNumber(hospital.getRegistrationNumber());
                if (existingHospital.isPresent()) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Hospital with this registration number already exists");
                    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
                }
            }
            
            Hospital savedHospital = hospitalService.saveHospital(hospital);
            return new ResponseEntity<>(savedHospital, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error creating hospital: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateHospital(@PathVariable Long id, @RequestBody Hospital hospitalDetails) {
        try {
            Optional<Hospital> optionalHospital = hospitalService.getHospitalById(id);
            
            if (!optionalHospital.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Hospital not found with id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            Hospital hospital = optionalHospital.get();
            hospital.setName(hospitalDetails.getName());
            hospital.setAddress(hospitalDetails.getAddress());
            hospital.setContactPerson(hospitalDetails.getContactPerson());
            hospital.setPhone(hospitalDetails.getPhone());
            hospital.setStatus(hospitalDetails.getStatus());
            
            // Only update email if it's different and doesn't conflict with another hospital
            if (!hospital.getEmail().equals(hospitalDetails.getEmail())) {
                Optional<Hospital> emailCheck = hospitalService.findByEmail(hospitalDetails.getEmail());
                if (emailCheck.isPresent() && !emailCheck.get().getId().equals(id)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Hospital with this email already exists");
                    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
                }
                hospital.setEmail(hospitalDetails.getEmail());
            }
            
            // Only update registration number if it's different and doesn't conflict
            if (hospitalDetails.getRegistrationNumber() != null && 
                    (hospital.getRegistrationNumber() == null || 
                    !hospital.getRegistrationNumber().equals(hospitalDetails.getRegistrationNumber()))) {
                Optional<Hospital> regCheck = hospitalService.findByRegistrationNumber(hospitalDetails.getRegistrationNumber());
                if (regCheck.isPresent() && !regCheck.get().getId().equals(id)) {
                    Map<String, String> response = new HashMap<>();
                    response.put("message", "Hospital with this registration number already exists");
                    return new ResponseEntity<>(response, HttpStatus.CONFLICT);
                }
                hospital.setRegistrationNumber(hospitalDetails.getRegistrationNumber());
            }
            
            Hospital updatedHospital = hospitalService.saveHospital(hospital);
            return new ResponseEntity<>(updatedHospital, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error updating hospital: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteHospital(@PathVariable Long id) {
        try {
            Optional<Hospital> hospital = hospitalService.getHospitalById(id);
            
            if (!hospital.isPresent()) {
                Map<String, String> response = new HashMap<>();
                response.put("message", "Hospital not found with id: " + id);
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
            
            hospitalService.deleteHospital(id);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Hospital deleted successfully");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("message", "Error deleting hospital: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Hospital>> searchHospitals(@RequestParam String query) {
        List<Hospital> hospitals = hospitalService.searchHospitals(query);
        return new ResponseEntity<>(hospitals, HttpStatus.OK);
    }
}