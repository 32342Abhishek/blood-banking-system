package com.example.demo.controller;

import com.example.demo.model.BloodInventory;
import com.example.demo.service.BloodInventoryService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/blood-inventory")
public class BloodInventoryController {

    private final BloodInventoryService bloodInventoryService;

    @Autowired
    public BloodInventoryController(BloodInventoryService bloodInventoryService) {
        this.bloodInventoryService = bloodInventoryService;
    }

    @PostMapping
    public ResponseEntity<BloodInventory> addBloodInventory(@RequestBody BloodInventory bloodInventory) {
        BloodInventory savedInventory = bloodInventoryService.saveBloodInventory(bloodInventory);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedInventory);
    }

    @GetMapping
    public ResponseEntity<List<BloodInventory>> getAllBloodInventory() {
        List<BloodInventory> inventory = bloodInventoryService.getAllBloodInventory();
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBloodInventoryById(@PathVariable Long id) {
        Optional<BloodInventory> inventory = bloodInventoryService.getBloodInventoryById(id);
        
        if (inventory.isPresent()) {
            return ResponseEntity.ok(inventory.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/blood-group/{bloodGroup}")
    public ResponseEntity<List<BloodInventory>> getBloodInventoryByBloodGroup(@PathVariable String bloodGroup) {
        List<BloodInventory> inventory = bloodInventoryService.getBloodInventoryByBloodGroup(bloodGroup);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<BloodInventory>> getBloodInventoryByStatus(@PathVariable String status) {
        List<BloodInventory> inventory = bloodInventoryService.getBloodInventoryByStatus(status);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/expiring/{days}")
    public ResponseEntity<List<BloodInventory>> getExpiringBloodInventory(@PathVariable int days) {
        List<BloodInventory> inventory = bloodInventoryService.getExpiringBloodInventory(days);
        return ResponseEntity.ok(inventory);
    }

    @GetMapping("/stock")
    public ResponseEntity<Map<String, Integer>> getBloodStock() {
        Map<String, Integer> bloodStock = bloodInventoryService.getAvailableBloodStock();
        return ResponseEntity.ok(bloodStock);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateBloodInventoryStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<BloodInventory> updatedInventory = bloodInventoryService.updateBloodInventoryStatus(id, status);
        
        if (updatedInventory.isPresent()) {
            return ResponseEntity.ok(updatedInventory.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBloodInventory(@PathVariable Long id, @RequestBody BloodInventory bloodInventory) {
        Optional<BloodInventory> existingInventory = bloodInventoryService.getBloodInventoryById(id);
        
        if (existingInventory.isPresent()) {
            bloodInventory.setId(id);
            BloodInventory updatedInventory = bloodInventoryService.saveBloodInventory(bloodInventory);
            return ResponseEntity.ok(updatedInventory);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/allocate")
    public ResponseEntity<?> allocateBlood(@RequestParam String bloodGroup, @RequestParam int units) {
        boolean allocated = bloodInventoryService.allocateBlood(bloodGroup, units);
        
        if (allocated) {
            return ResponseEntity.ok().body("Successfully allocated " + units + " units of " + bloodGroup + " blood");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unable to allocate blood. Insufficient inventory.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBloodInventory(@PathVariable Long id) {
        Optional<BloodInventory> existingInventory = bloodInventoryService.getBloodInventoryById(id);
        
        if (existingInventory.isPresent()) {
            bloodInventoryService.deleteBloodInventory(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getBloodInventorySummary() {
        Map<String, Object> summary = bloodInventoryService.getBloodInventorySummary();
        return ResponseEntity.ok(summary);
    }
    
    @PostMapping("/transfer")
    public ResponseEntity<?> transferBloodUnits(
            @RequestParam Long sourceId, 
            @RequestParam Long targetId, 
            @RequestParam int units) {
        boolean transferred = bloodInventoryService.transferBloodUnits(sourceId, targetId, units);
        
        if (transferred) {
            return ResponseEntity.ok().body("Successfully transferred " + units + " units");
        } else {
            return ResponseEntity.badRequest().body("Failed to transfer units. Please check source and target inventory items.");
        }
    }
    
    @GetMapping("/compatibility")
    public ResponseEntity<Boolean> checkBloodCompatibility(
            @RequestParam String recipientBloodGroup, 
            @RequestParam String donorBloodGroup) {
        boolean compatible = bloodInventoryService.isCompatible(recipientBloodGroup, donorBloodGroup);
        return ResponseEntity.ok(compatible);
    }
    
    @GetMapping("/compatible-blood")
    public ResponseEntity<Map<String, Integer>> findCompatibleBlood(
            @RequestParam String recipientBloodGroup,
            @RequestParam(required = false, defaultValue = "1") int unitsNeeded) {
        Map<String, Integer> compatibleBlood = bloodInventoryService.findCompatibleBlood(recipientBloodGroup, unitsNeeded);
        return ResponseEntity.ok(compatibleBlood);
    }
}