package com.example.demo.controller;

import com.example.demo.dto.LoginRequest;
import com.example.demo.model.Donor;
import com.example.demo.service.DonorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/donors")
public class DonorController {

    private final DonorService donorService;

    @Autowired
    public DonorController(DonorService donorService) {
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<?> registerDonor(@RequestBody Donor donor) {
        // Check if the username or email already exists
        if (donorService.getDonorByUsername(donor.getUsername()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Username already taken");
        }

        if (donorService.getDonorByEmail(donor.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email already registered");
        }

        // Save the donor
        Donor savedDonor = donorService.saveDonor(donor);
        
        // Remove password from the response
        savedDonor.setPassword(null);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDonor);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginDonor(@RequestBody LoginRequest loginRequest) {
        Optional<Donor> donor = donorService.authenticateDonor(loginRequest.getUsername(), loginRequest.getPassword());
        
        if (donor.isPresent()) {
            // Remove password from the response
            Donor authenticatedDonor = donor.get();
            authenticatedDonor.setPassword(null);
            
            return ResponseEntity.ok(authenticatedDonor);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
        }
    }

    @GetMapping
    public ResponseEntity<List<Donor>> getAllDonors() {
        List<Donor> donors = donorService.getAllDonors();
        
        // Remove passwords from response
        donors.forEach(donor -> donor.setPassword(null));
        
        return ResponseEntity.ok(donors);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getDonorById(@PathVariable Long id) {
        Optional<Donor> donor = donorService.getDonorById(id);
        
        if (donor.isPresent()) {
            // Remove password from response
            Donor foundDonor = donor.get();
            foundDonor.setPassword(null);
            
            return ResponseEntity.ok(foundDonor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/bloodGroup/{bloodGroup}")
    public ResponseEntity<List<Donor>> getDonorsByBloodGroup(@PathVariable String bloodGroup) {
        List<Donor> donors = donorService.getDonorsByBloodGroup(bloodGroup);
        
        // Remove passwords from response
        donors.forEach(donor -> donor.setPassword(null));
        
        return ResponseEntity.ok(donors);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<Donor>> getDonorsByLocation(@PathVariable String location) {
        List<Donor> donors = donorService.getDonorsByLocation(location);
        
        // Remove passwords from response
        donors.forEach(donor -> donor.setPassword(null));
        
        return ResponseEntity.ok(donors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateDonor(@PathVariable Long id, @RequestBody Donor donor) {
        Optional<Donor> existingDonor = donorService.getDonorById(id);
        
        if (existingDonor.isPresent()) {
            // Update donor fields, but don't change the ID
            donor.setId(id);
            
            Donor updatedDonor = donorService.saveDonor(donor);
            
            // Remove password from response
            updatedDonor.setPassword(null);
            
            return ResponseEntity.ok(updatedDonor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/availability")
    public ResponseEntity<?> updateDonorAvailability(@PathVariable Long id, @RequestParam boolean available) {
        Optional<Donor> updatedDonor = donorService.updateDonorAvailability(id, available);
        
        if (updatedDonor.isPresent()) {
            // Remove password from response
            updatedDonor.get().setPassword(null);
            
            return ResponseEntity.ok(updatedDonor.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDonor(@PathVariable Long id) {
        Optional<Donor> existingDonor = donorService.getDonorById(id);
        
        if (existingDonor.isPresent()) {
            donorService.deleteDonor(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchDonorByEmail(@RequestParam String email) {
        Optional<Donor> donor = donorService.getDonorByEmail(email);
        
        if (donor.isPresent()) {
            // Remove password from response
            Donor foundDonor = donor.get();
            foundDonor.setPassword(null);
            
            return ResponseEntity.ok(foundDonor);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}