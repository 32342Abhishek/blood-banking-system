package com.example.demo.controller;

import com.example.demo.model.BloodRequest;
import com.example.demo.model.Hospital;
import com.example.demo.service.BloodRequestService;
import com.example.demo.service.HospitalService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/blood-requests")
@CrossOrigin(origins = "*")
public class BloodRequestController {

    private final BloodRequestService bloodRequestService;
    private final HospitalService hospitalService;

    @Autowired
    public BloodRequestController(BloodRequestService bloodRequestService, HospitalService hospitalService) {
        this.bloodRequestService = bloodRequestService;
        this.hospitalService = hospitalService;
    }

    @PostMapping
    public ResponseEntity<BloodRequest> createBloodRequest(@RequestBody BloodRequest bloodRequest) {
        // Log incoming request data
        System.out.println("Received blood request: " + bloodRequest);
        
        // Set default status if not provided
        if (bloodRequest.getRequestStatus() == null || bloodRequest.getRequestStatus().isEmpty()) {
            bloodRequest.setRequestStatus("PENDING");
        }
        
        // Validate required fields
        if (bloodRequest.getName() == null || bloodRequest.getName().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        if (bloodRequest.getBloodGroup() == null || bloodRequest.getBloodGroup().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        
        // Save the request
        try {
            BloodRequest savedRequest = bloodRequestService.saveBloodRequest(bloodRequest);
            System.out.println("Successfully saved blood request: " + savedRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedRequest);
        } catch (Exception e) {
            System.err.println("Error saving blood request: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<BloodRequest>> getAllBloodRequests() {
        List<BloodRequest> requests = bloodRequestService.getAllBloodRequests();
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBloodRequestById(@PathVariable Long id) {
        Optional<BloodRequest> request = bloodRequestService.getBloodRequestById(id);
        
        if (request.isPresent()) {
            return ResponseEntity.ok(request.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/bloodGroup/{bloodGroup}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByBloodGroup(@PathVariable String bloodGroup) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByBloodGroup(bloodGroup);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByLocation(@PathVariable String location) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByLocation(location);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByStatus(@PathVariable String status) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByStatus(status);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByEmail(@PathVariable String email) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByEmail(email);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodRequest(@PathVariable Long id, @RequestBody BloodRequest bloodRequest) {
        Optional<BloodRequest> existingRequest = bloodRequestService.getBloodRequestById(id);
        
        if (existingRequest.isPresent()) {
            // Update request fields, but don't change the ID
            bloodRequest.setId(id);
            
            BloodRequest updatedRequest = bloodRequestService.saveBloodRequest(bloodRequest);
            return ResponseEntity.ok(updatedRequest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBloodRequestStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<BloodRequest> updatedRequest = bloodRequestService.updateBloodRequestStatus(id, status);
        
        if (updatedRequest.isPresent()) {
            return ResponseEntity.ok(updatedRequest.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodRequest(@PathVariable Long id) {
        Optional<BloodRequest> existingRequest = bloodRequestService.getBloodRequestById(id);
        
        if (existingRequest.isPresent()) {
            bloodRequestService.deleteBloodRequest(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByHospital(@PathVariable Long hospitalId) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByHospital(hospitalId);
        return ResponseEntity.ok(requests);
    }
    
    @GetMapping("/priority/{priority}")
    public ResponseEntity<List<BloodRequest>> getBloodRequestsByPriority(@PathVariable String priority) {
        List<BloodRequest> requests = bloodRequestService.getBloodRequestsByPriority(priority);
        return ResponseEntity.ok(requests);
    }
    
    @PutMapping("/{id}/units-provided")
    public ResponseEntity<?> updateUnitsProvided(@PathVariable Long id, @RequestParam Integer unitsProvided) {
        Optional<BloodRequest> updatedRequest = bloodRequestService.updateUnitsProvided(id, unitsProvided);
        
        if (updatedRequest.isPresent()) {
            return ResponseEntity.ok(updatedRequest.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PostMapping("/hospital/{hospitalId}")
    public ResponseEntity<?> createHospitalRequest(@PathVariable Long hospitalId, @RequestBody BloodRequest bloodRequest) {
        Optional<Hospital> hospital = hospitalService.getHospitalById(hospitalId);
        
        if (hospital.isPresent()) {
            BloodRequest createdRequest = bloodRequestService.createHospitalRequest(bloodRequest, hospital.get());
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}