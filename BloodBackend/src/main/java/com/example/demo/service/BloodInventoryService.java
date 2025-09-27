package com.example.demo.service;

import com.example.demo.model.BloodInventory;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface BloodInventoryService {
    
    /**
     * Save a blood inventory item
     * 
     * @param bloodInventory The blood inventory item to save
     * @return The saved blood inventory item
     */
    BloodInventory saveBloodInventory(BloodInventory bloodInventory);
    
    /**
     * Get a blood inventory item by ID
     * 
     * @param id The ID of the blood inventory item to retrieve
     * @return An Optional containing the blood inventory item if found
     */
    Optional<BloodInventory> getBloodInventoryById(Long id);
    
    /**
     * Get all blood inventory items
     * 
     * @return A list of all blood inventory items
     */
    List<BloodInventory> getAllBloodInventory();
    
    /**
     * Get blood inventory items by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood inventory items for the given blood group
     */
    List<BloodInventory> getBloodInventoryByBloodGroup(String bloodGroup);
    
    /**
     * Get blood inventory items by status
     * 
     * @param status The status to search for
     * @return A list of blood inventory items with the given status
     */
    List<BloodInventory> getBloodInventoryByStatus(String status);
    
    /**
     * Get blood inventory items that are expiring soon
     * 
     * @param days The number of days from now
     * @return A list of blood inventory items expiring within the given days
     */
    List<BloodInventory> getExpiringBloodInventory(int days);
    
    /**
     * Update blood inventory status
     * 
     * @param id The ID of the blood inventory item
     * @param status The new status
     * @return The updated blood inventory item if found, otherwise empty Optional
     */
    Optional<BloodInventory> updateBloodInventoryStatus(Long id, String status);
    
    /**
     * Delete a blood inventory item
     * 
     * @param id The ID of the blood inventory item to delete
     */
    void deleteBloodInventory(Long id);
    
    /**
     * Get the total available units of each blood group
     * 
     * @return A map of blood group to total available units
     */
    Map<String, Integer> getAvailableBloodStock();
    
    /**
     * Allocate blood units for a request
     * 
     * @param bloodGroup The requested blood group
     * @param units The number of units requested
     * @return True if the allocation was successful, false otherwise
     */
    boolean allocateBlood(String bloodGroup, int units);
    
    /**
     * Get a summary of blood inventory status
     * 
     * @return A map containing blood inventory statistics
     */
    Map<String, Object> getBloodInventorySummary();
    
    /**
     * Transfer blood units from one inventory item to another
     * 
     * @param sourceId Source inventory item ID
     * @param targetId Target inventory item ID
     * @param units Number of units to transfer
     * @return True if transfer was successful, false otherwise
     */
    boolean transferBloodUnits(Long sourceId, Long targetId, int units);
    
    /**
     * Check compatibility of blood groups
     * 
     * @param recipientBloodGroup Recipient blood group
     * @param donorBloodGroup Donor blood group
     * @return True if compatible, false otherwise
     */
    boolean isCompatible(String recipientBloodGroup, String donorBloodGroup);
    
    /**
     * Find compatible blood for a recipient
     * 
     * @param recipientBloodGroup The recipient's blood group
     * @param unitsNeeded The number of units needed
     * @return A map of compatible blood groups and available units
     */
    Map<String, Integer> findCompatibleBlood(String recipientBloodGroup, int unitsNeeded);
    
    /**
     * Find the latest blood inventory item for a specific blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return An Optional containing the latest inventory item for the given blood group if found
     */
    Optional<BloodInventory> findLatestByBloodGroup(String bloodGroup);
}