package com.example.demo.repository;

import com.example.demo.model.BloodInventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodInventoryRepository extends JpaRepository<BloodInventory, Long> {
    
    /**
     * Find blood inventory items by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood inventory items for the given blood group
     */
    List<BloodInventory> findByBloodGroup(String bloodGroup);
    
    /**
     * Find blood inventory items by status
     * 
     * @param status The status to search for
     * @return A list of blood inventory items with the given status
     */
    List<BloodInventory> findByStatus(String status);
    
    /**
     * Find blood inventory items by blood group and status
     * 
     * @param bloodGroup The blood group to search for
     * @param status The status to search for
     * @return A list of blood inventory items for the given blood group and status
     */
    List<BloodInventory> findByBloodGroupAndStatus(String bloodGroup, String status);
    
    /**
     * Find blood inventory items that are expiring soon
     * 
     * @param date The date to compare against
     * @return A list of blood inventory items expiring before the given date
     */
    List<BloodInventory> findByExpiryDateBeforeAndStatus(LocalDateTime date, String status);
    
    /**
     * Get the total units of a specific blood group
     * 
     * @param bloodGroup The blood group to calculate for
     * @param status The status to filter by (typically "AVAILABLE")
     * @return The total units of the blood group with the specified status
     */
    @Query("SELECT SUM(b.units) FROM BloodInventory b WHERE b.bloodGroup = ?1 AND b.status = ?2")
    Integer getTotalUnitsByBloodGroupAndStatus(String bloodGroup, String status);
    
    /**
     * Find the latest blood inventory item for a specific blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return The latest inventory item for the given blood group
     */
    @Query("SELECT b FROM BloodInventory b WHERE b.bloodGroup = ?1 ORDER BY b.updatedAt DESC")
    List<BloodInventory> findLatestByBloodGroup(String bloodGroup);
}