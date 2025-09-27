package com.example.demo.service;

import com.example.demo.model.BloodInventory;
import com.example.demo.repository.BloodInventoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BloodInventoryServiceImpl implements BloodInventoryService {

    private final BloodInventoryRepository bloodInventoryRepository;
    
    private static final String[] BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"};

    @Autowired
    public BloodInventoryServiceImpl(BloodInventoryRepository bloodInventoryRepository) {
        this.bloodInventoryRepository = bloodInventoryRepository;
    }

    @Override
    public BloodInventory saveBloodInventory(BloodInventory bloodInventory) {
        // Set creation and update timestamps
        if (bloodInventory.getId() == null) {
            bloodInventory.setCreatedAt(LocalDateTime.now());
        }
        bloodInventory.setUpdatedAt(LocalDateTime.now());
        bloodInventory.setLastUpdated(LocalDateTime.now());
        
        return bloodInventoryRepository.save(bloodInventory);
    }

    @Override
    public Optional<BloodInventory> getBloodInventoryById(Long id) {
        return bloodInventoryRepository.findById(id);
    }

    @Override
    public List<BloodInventory> getAllBloodInventory() {
        return bloodInventoryRepository.findAll();
    }

    @Override
    public List<BloodInventory> getBloodInventoryByBloodGroup(String bloodGroup) {
        return bloodInventoryRepository.findByBloodGroup(bloodGroup);
    }

    @Override
    public List<BloodInventory> getBloodInventoryByStatus(String status) {
        return bloodInventoryRepository.findByStatus(status);
    }

    @Override
    public List<BloodInventory> getExpiringBloodInventory(int days) {
        LocalDateTime expiryDate = LocalDateTime.now().plusDays(days);
        return bloodInventoryRepository.findByExpiryDateBeforeAndStatus(expiryDate, "AVAILABLE");
    }

    @Override
    public Optional<BloodInventory> updateBloodInventoryStatus(Long id, String status) {
        Optional<BloodInventory> inventoryOpt = bloodInventoryRepository.findById(id);
        
        if (inventoryOpt.isPresent()) {
            BloodInventory inventory = inventoryOpt.get();
            inventory.setStatus(status);
            inventory.setLastUpdated(LocalDateTime.now());
            inventory.setUpdatedAt(LocalDateTime.now());
            return Optional.of(bloodInventoryRepository.save(inventory));
        }
        
        return Optional.empty();
    }

    @Override
    public void deleteBloodInventory(Long id) {
        bloodInventoryRepository.deleteById(id);
    }

    @Override
    public Map<String, Integer> getAvailableBloodStock() {
        Map<String, Integer> bloodStock = new HashMap<>();
        
        for (String bloodGroup : BLOOD_GROUPS) {
            Integer units = bloodInventoryRepository.getTotalUnitsByBloodGroupAndStatus(bloodGroup, "AVAILABLE");
            bloodStock.put(bloodGroup, units != null ? units : 0);
        }
        
        return bloodStock;
    }

    @Override
    @Transactional
    public boolean allocateBlood(String bloodGroup, int units) {
        // Check if we have enough units available
        Integer availableUnits = bloodInventoryRepository.getTotalUnitsByBloodGroupAndStatus(bloodGroup, "AVAILABLE");
        
        if (availableUnits == null || availableUnits < units) {
            return false;
        }
        
        // Get available blood inventory items for the blood group
        List<BloodInventory> inventoryItems = bloodInventoryRepository.findByBloodGroupAndStatus(bloodGroup, "AVAILABLE");
        
        int remainingUnits = units;
        
        // Allocate from the inventory items
        for (BloodInventory item : inventoryItems) {
            if (remainingUnits <= 0) {
                break;
            }
            
            if (item.getUnits() <= remainingUnits) {
                // Use all units in this inventory item
                item.setStatus("RESERVED");
                remainingUnits -= item.getUnits();
            } else {
                // Split the inventory item
                BloodInventory newItem = new BloodInventory();
                newItem.setBloodGroup(item.getBloodGroup());
                newItem.setUnits(remainingUnits);
                newItem.setExpiryDate(item.getExpiryDate());
                newItem.setStatus("RESERVED");
                newItem.setHospitalId(item.getHospitalId());
                newItem.setDonationId(item.getDonationId());
                
                // Update the original item
                item.setUnits(item.getUnits() - remainingUnits);
                
                // Save the new item
                bloodInventoryRepository.save(newItem);
                
                remainingUnits = 0;
            }
            
            // Update the item
            item.setLastUpdated(LocalDateTime.now());
            item.setUpdatedAt(LocalDateTime.now());
            bloodInventoryRepository.save(item);
        }
        
        return remainingUnits == 0;
    }
    
    /**
     * Get a summary of blood inventory status
     * 
     * @return A map containing blood inventory statistics
     */
    @Override
    public Map<String, Object> getBloodInventorySummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Get total available units by blood group
        Map<String, Integer> availableBlood = getAvailableBloodStock();
        summary.put("availableBlood", availableBlood);
        
        // Calculate total units
        int totalUnits = availableBlood.values().stream().mapToInt(Integer::intValue).sum();
        summary.put("totalAvailableUnits", totalUnits);
        
        // Get expiring blood in next 7 days
        List<BloodInventory> expiringBlood = getExpiringBloodInventory(7);
        summary.put("expiringBloodCount", expiringBlood.size());
        
        // Get critical levels (blood groups with less than 5 units)
        Map<String, Integer> criticalLevels = availableBlood.entrySet().stream()
            .filter(entry -> entry.getValue() < 5)
            .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
        summary.put("criticalLevels", criticalLevels);
        
        return summary;
    }
    
    /**
     * Transfer blood units from one inventory item to another
     * 
     * @param sourceId Source inventory item ID
     * @param targetId Target inventory item ID
     * @param units Number of units to transfer
     * @return True if transfer was successful, false otherwise
     */
    @Override
    @Transactional
    public boolean transferBloodUnits(Long sourceId, Long targetId, int units) {
        Optional<BloodInventory> sourceOpt = bloodInventoryRepository.findById(sourceId);
        Optional<BloodInventory> targetOpt = bloodInventoryRepository.findById(targetId);
        
        if (sourceOpt.isEmpty() || targetOpt.isEmpty()) {
            return false;
        }
        
        BloodInventory source = sourceOpt.get();
        BloodInventory target = targetOpt.get();
        
        // Check if source has enough units
        if (source.getUnits() < units) {
            return false;
        }
        
        // Check if blood groups match
        if (!source.getBloodGroup().equals(target.getBloodGroup())) {
            return false;
        }
        
        // Transfer units
        source.setUnits(source.getUnits() - units);
        target.setUnits(target.getUnits() + units);
        
        // Update timestamps
        LocalDateTime now = LocalDateTime.now();
        source.setUpdatedAt(now);
        source.setLastUpdated(now);
        target.setUpdatedAt(now);
        target.setLastUpdated(now);
        
        // Save changes
        bloodInventoryRepository.save(source);
        bloodInventoryRepository.save(target);
        
        return true;
    }
    
    /**
     * Check compatibility of blood groups
     * 
     * @param recipientBloodGroup Recipient blood group
     * @param donorBloodGroup Donor blood group
     * @return True if compatible, false otherwise
     */
    @Override
    public boolean isCompatible(String recipientBloodGroup, String donorBloodGroup) {
        // Blood compatibility chart
        Map<String, List<String>> compatibilityChart = new HashMap<>();
        
        // O- can donate to anyone
        compatibilityChart.put("O-", List.of("O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"));
        
        // O+ can donate to O+, A+, B+, AB+
        compatibilityChart.put("O+", List.of("O+", "A+", "B+", "AB+"));
        
        // A- can donate to A+, A-, AB+, AB-
        compatibilityChart.put("A-", List.of("A+", "A-", "AB+", "AB-"));
        
        // A+ can donate to A+, AB+
        compatibilityChart.put("A+", List.of("A+", "AB+"));
        
        // B- can donate to B+, B-, AB+, AB-
        compatibilityChart.put("B-", List.of("B+", "B-", "AB+", "AB-"));
        
        // B+ can donate to B+, AB+
        compatibilityChart.put("B+", List.of("B+", "AB+"));
        
        // AB- can donate to AB+, AB-
        compatibilityChart.put("AB-", List.of("AB+", "AB-"));
        
        // AB+ can donate only to AB+
        compatibilityChart.put("AB+", List.of("AB+"));
        
        // Check compatibility
        List<String> compatibleRecipients = compatibilityChart.get(donorBloodGroup);
        return compatibleRecipients != null && compatibleRecipients.contains(recipientBloodGroup);
    }
    
    /**
     * Find compatible blood for a recipient
     * 
     * @param recipientBloodGroup The recipient's blood group
     * @param unitsNeeded The number of units needed
     * @return A map of compatible blood groups and available units
     */
    @Override
    public Map<String, Integer> findCompatibleBlood(String recipientBloodGroup, int unitsNeeded) {
        Map<String, Integer> compatibleBlood = new HashMap<>();
        
        for (String bloodGroup : BLOOD_GROUPS) {
            if (isCompatible(recipientBloodGroup, bloodGroup)) {
                Integer availableUnits = bloodInventoryRepository.getTotalUnitsByBloodGroupAndStatus(bloodGroup, "AVAILABLE");
                if (availableUnits != null && availableUnits > 0) {
                    compatibleBlood.put(bloodGroup, availableUnits);
                }
            }
        }
        
        return compatibleBlood;
    }
    
    /**
     * Find the latest blood inventory item for a specific blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return An Optional containing the latest inventory item for the given blood group if found
     */
    @Override
    public Optional<BloodInventory> findLatestByBloodGroup(String bloodGroup) {
        List<BloodInventory> inventoryList = bloodInventoryRepository.findLatestByBloodGroup(bloodGroup);
        return inventoryList.isEmpty() ? Optional.empty() : Optional.of(inventoryList.get(0));
    }
}