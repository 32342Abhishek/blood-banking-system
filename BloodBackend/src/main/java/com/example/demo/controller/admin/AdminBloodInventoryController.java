package com.example.demo.controller.admin;

import com.example.demo.model.BloodInventory;
import com.example.demo.service.BloodInventoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

/**
 * Controller for admin-only blood inventory operations
 */
@RestController
@RequestMapping("/api/blood-inventory")
@CrossOrigin(origins = "*", allowedHeaders = "*", exposedHeaders = "Authorization")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
public class AdminBloodInventoryController {

    private final BloodInventoryService bloodInventoryService;
    
    @Autowired
    public AdminBloodInventoryController(BloodInventoryService bloodInventoryService) {
        this.bloodInventoryService = bloodInventoryService;
    }
    
    /**
     * Update blood inventory stock levels (admin only)
     * This endpoint allows bulk updating of blood inventory levels
     */
    @PutMapping("/update")
    public ResponseEntity<?> updateBloodInventory(@RequestBody Map<String, Integer> updates, @RequestHeader(name = "Authorization", required = false) String authHeader) {
        System.out.println("Received blood inventory update request: " + updates);
        System.out.println("Auth header present: " + (authHeader != null ? "Yes" : "No"));
        
        // Log headers for debugging
        System.out.println("Headers received:");
        if (authHeader != null) {
            System.out.println("Authorization: " + (authHeader.length() > 15 ? 
                authHeader.substring(0, 15) + "..." : authHeader));
        }
        
        try {
            Map<String, Object> result = new HashMap<>();
            boolean allSuccess = true;
            
            // Process each blood group update
            for (Map.Entry<String, Integer> entry : updates.entrySet()) {
                String bloodGroup = entry.getKey();
                Integer quantity = entry.getValue();
                
                if (bloodGroup != null && quantity != null) {
                    // Find existing inventory for this blood group or create new
                    Optional<BloodInventory> inventoryOpt = bloodInventoryService.findLatestByBloodGroup(bloodGroup);
                    
                    if (inventoryOpt.isPresent()) {
                        BloodInventory inventory = inventoryOpt.get();
                        inventory.setUnits(quantity);
                        bloodInventoryService.saveBloodInventory(inventory);
                        result.put(bloodGroup, "Updated to " + quantity + " units");
                    } else {
                        // Create new inventory entry if none exists
                        BloodInventory newInventory = new BloodInventory();
                        newInventory.setBloodGroup(bloodGroup);
                        newInventory.setUnits(quantity);
                        newInventory.setStatus("AVAILABLE");
                        bloodInventoryService.saveBloodInventory(newInventory);
                        result.put(bloodGroup, "Created with " + quantity + " units");
                    }
                } else {
                    result.put(bloodGroup != null ? bloodGroup : "unknown", "Invalid data");
                    allSuccess = false;
                }
            }
            
            System.out.println("Blood inventory update completed: " + result);
            
            if (allSuccess) {
                return ResponseEntity.ok().body(result);
            } else {
                return ResponseEntity.badRequest().body(result);
            }
        } catch (Exception e) {
            System.err.println("Error updating blood inventory: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error updating inventory: " + e.getMessage());
        }
    }
}