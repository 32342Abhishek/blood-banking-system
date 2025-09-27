package com.example.demo.controller;

import com.example.demo.model.BloodDonation;
import com.example.demo.model.Donor;
import com.example.demo.service.BloodDonationService;
import com.example.demo.service.DonorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blood-donations")
public class BloodDonationController {

    private final BloodDonationService bloodDonationService;
    private final DonorService donorService;

    @Autowired
    public BloodDonationController(BloodDonationService bloodDonationService, DonorService donorService) {
        this.bloodDonationService = bloodDonationService;
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<?> createBloodDonation(@RequestBody BloodDonation bloodDonation) {
        // Donor must exist
        if (bloodDonation.getDonor() == null || bloodDonation.getDonor().getId() == null) {
            return ResponseEntity.badRequest().body("Donor information is required");
        }
        
        Optional<Donor> donorOpt = donorService.getDonorById(bloodDonation.getDonor().getId());
        if (!donorOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }
        
        // Set donor and blood group
        bloodDonation.setDonor(donorOpt.get());
        if (bloodDonation.getBloodGroup() == null) {
            bloodDonation.setBloodGroup(donorOpt.get().getBloodGroup());
        }
        
        // Save the donation
        BloodDonation savedDonation = bloodDonationService.saveBloodDonation(bloodDonation);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDonation);
    }

    @PostMapping("/record")
    public ResponseEntity<?> recordDonation(
            @RequestParam Long donorId,
            @RequestParam Integer quantityMl,
            @RequestParam(defaultValue = "NORMAL") String healthStatus,
            @RequestParam(required = false) String notes) {
        
        Optional<Donor> donorOpt = donorService.getDonorById(donorId);
        if (!donorOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }
        
        BloodDonation donation = bloodDonationService.recordDonation(
                donorOpt.get(), quantityMl, healthStatus, notes);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(donation);
    }

    @GetMapping
    public ResponseEntity<List<BloodDonation>> getAllBloodDonations() {
        List<BloodDonation> donations = bloodDonationService.getAllBloodDonations();
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBloodDonationById(@PathVariable Long id) {
        Optional<BloodDonation> donation = bloodDonationService.getBloodDonationById(id);
        
        if (donation.isPresent()) {
            return ResponseEntity.ok(donation.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<BloodDonation>> getBloodDonationsByDonorId(@PathVariable Long donorId) {
        List<BloodDonation> donations = bloodDonationService.getBloodDonationsByDonorId(donorId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public ResponseEntity<List<BloodDonation>> getBloodDonationsByBloodGroup(@PathVariable String bloodGroup) {
        List<BloodDonation> donations = bloodDonationService.getBloodDonationsByBloodGroup(bloodGroup);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<BloodDonation>> getBloodDonationsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<BloodDonation> donations = bloodDonationService.getBloodDonationsInDateRange(startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @GetMapping("/donor/{donorId}/latest")
    public ResponseEntity<?> getLatestDonationByDonorId(@PathVariable Long donorId) {
        Optional<BloodDonation> donation = bloodDonationService.getLatestDonationByDonorId(donorId);
        
        if (donation.isPresent()) {
            return ResponseEntity.ok(donation.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/donor/{donorId}/count")
    public ResponseEntity<Long> getDonationCountByDonorId(@PathVariable Long donorId) {
        Long count = bloodDonationService.getDonationCountByDonorId(donorId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodDonation(@PathVariable Long id, @RequestBody BloodDonation bloodDonation) {
        Optional<BloodDonation> existingDonation = bloodDonationService.getBloodDonationById(id);
        
        if (existingDonation.isPresent()) {
            bloodDonation.setId(id);
            BloodDonation updatedDonation = bloodDonationService.saveBloodDonation(bloodDonation);
            return ResponseEntity.ok(updatedDonation);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodDonation(@PathVariable Long id) {
        Optional<BloodDonation> existingDonation = bloodDonationService.getBloodDonationById(id);
        
        if (existingDonation.isPresent()) {
            bloodDonationService.deleteBloodDonation(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}