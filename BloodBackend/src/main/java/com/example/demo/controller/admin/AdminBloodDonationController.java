package com.example.demo.controller.admin;

import com.example.demo.model.BloodDonation;
import com.example.demo.service.BloodDonationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for admin-only blood donation operations
 */
@RestController
@RequestMapping("/api/blood-donations")
@CrossOrigin(origins = "*")
public class AdminBloodDonationController {

    private final BloodDonationService bloodDonationService;
    
    @Autowired
    public AdminBloodDonationController(BloodDonationService bloodDonationService) {
        this.bloodDonationService = bloodDonationService;
    }
    
    /**
     * Get pending blood donations (admin only)
     * Returns donations that need approval
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BloodDonation>> getPendingDonations() {
        // Get all donations and filter for pending status
        List<BloodDonation> allDonations = bloodDonationService.getAllBloodDonations();
        List<BloodDonation> pendingDonations = allDonations.stream()
            .filter(donation -> "PENDING".equals(donation.getDonationStatus()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(pendingDonations);
    }
    
    /**
     * Approve a pending donation (admin only)
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> approveDonation(@PathVariable Long id) {
        return bloodDonationService.getBloodDonationById(id)
            .map(donation -> {
                donation.setDonationStatus("APPROVED");
                BloodDonation updatedDonation = bloodDonationService.saveBloodDonation(donation);
                return ResponseEntity.ok(updatedDonation);
            })
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Reject a pending donation (admin only)
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> rejectDonation(@PathVariable Long id, @RequestBody(required = false) String reason) {
        return bloodDonationService.getBloodDonationById(id)
            .map(donation -> {
                donation.setDonationStatus("REJECTED");
                if (reason != null && !reason.isEmpty()) {
                    donation.setNotes(reason);
                }
                BloodDonation updatedDonation = bloodDonationService.saveBloodDonation(donation);
                return ResponseEntity.ok(updatedDonation);
            })
            .orElse(ResponseEntity.notFound().build());
    }
}