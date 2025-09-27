package com.example.demo.repository;

import com.example.demo.model.BloodDonation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BloodDonationRepository extends JpaRepository<BloodDonation, Long> {
    
    /**
     * Find blood donations by donor ID
     * 
     * @param donorId The donor ID to search for
     * @return A list of blood donations from the given donor
     */
    @Query("SELECT bd FROM BloodDonation bd WHERE bd.donor.id = ?1")
    List<BloodDonation> findByDonorId(Long donorId);
    
    /**
     * Find blood donations by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood donations of the given blood group
     */
    List<BloodDonation> findByBloodGroup(String bloodGroup);
    
    /**
     * Find blood donations within a date range
     * 
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return A list of blood donations within the given date range
     */
    List<BloodDonation> findByDonationDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find blood donations by health status
     * 
     * @param healthStatus The health status to search for
     * @return A list of blood donations with the given health status
     */
    List<BloodDonation> findByHealthStatus(String healthStatus);
    
    /**
     * Count the total donations for a given donor
     * 
     * @param donorId The donor ID to count donations for
     * @return The total number of donations for the donor
     */
    @Query("SELECT COUNT(bd) FROM BloodDonation bd WHERE bd.donor.id = ?1")
    Long countByDonorId(Long donorId);
    
    /**
     * Get the latest donation for a donor
     * 
     * @param donorId The donor ID to search for
     * @return The most recent blood donation for the donor
     */
    @Query("SELECT bd FROM BloodDonation bd WHERE bd.donor.id = ?1 ORDER BY bd.donationDate DESC")
    List<BloodDonation> findLatestDonationByDonorId(Long donorId);
}