package com.example.demo.controller.admin;

import com.example.demo.model.BloodRequest;
import com.example.demo.service.BloodRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller for admin-only blood request operations
 */
@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin(origins = "*")
public class AdminBloodRequestController {

    private final BloodRequestService bloodRequestService;
    
    @Autowired
    public AdminBloodRequestController(BloodRequestService bloodRequestService) {
        this.bloodRequestService = bloodRequestService;
    }
    
    /**
     * Get pending blood requests (admin only)
     * Returns requests that need approval
     */
    @GetMapping("/pending")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<BloodRequest>> getPendingRequests() {
        // Get all requests and filter for pending status
        List<BloodRequest> allRequests = bloodRequestService.getAllBloodRequests();
        List<BloodRequest> pendingRequests = allRequests.stream()
            .filter(request -> "PENDING".equals(request.getRequestStatus()))
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(pendingRequests);
    }
    
    /**
     * Approve a pending request (admin only)
     */
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> approveRequest(@PathVariable Long id) {
        return bloodRequestService.updateBloodRequestStatus(id, "FULFILLED")
            .map(updatedRequest -> ResponseEntity.ok(updatedRequest))
            .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Reject a pending request (admin only)
     */
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        return bloodRequestService.updateBloodRequestStatus(id, "CANCELLED")
            .map(updatedRequest -> ResponseEntity.ok(updatedRequest))
            .orElse(ResponseEntity.notFound().build());
    }
}