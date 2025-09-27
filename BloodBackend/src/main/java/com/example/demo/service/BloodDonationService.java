package com.example.demo.service;

import com.example.demo.model.BloodDonation;
import com.example.demo.model.Donor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BloodDonationService {
    
    /**
     * Save a blood donation
     * 
     * @param bloodDonation The blood donation to save
     * @return The saved blood donation
     */
    BloodDonation saveBloodDonation(BloodDonation bloodDonation);
    
    /**
     * Get a blood donation by ID
     * 
     * @param id The ID of the blood donation to retrieve
     * @return An Optional containing the blood donation if found
     */
    Optional<BloodDonation> getBloodDonationById(Long id);
    
    /**
     * Get all blood donations
     * 
     * @return A list of all blood donations
     */
    List<BloodDonation> getAllBloodDonations();
    
    /**
     * Get blood donations by donor ID
     * 
     * @param donorId The donor ID to search for
     * @return A list of blood donations from the given donor
     */
    List<BloodDonation> getBloodDonationsByDonorId(Long donorId);
    
    /**
     * Get blood donations by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood donations of the given blood group
     */
    List<BloodDonation> getBloodDonationsByBloodGroup(String bloodGroup);
    
    /**
     * Get blood donations within a date range
     * 
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return A list of blood donations within the given date range
     */
    List<BloodDonation> getBloodDonationsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Record a new blood donation
     * 
     * @param donor The donor making the donation
     * @param quantityMl The quantity of blood donated in milliliters
     * @param healthStatus The health status of the donor
     * @param notes Any additional notes
     * @return The new blood donation record
     */
    BloodDonation recordDonation(Donor donor, Integer quantityMl, String healthStatus, String notes);
    
    /**
     * Get the latest blood donation for a donor
     * 
     * @param donorId The donor ID to search for
     * @return An Optional containing the latest blood donation if any
     */
    Optional<BloodDonation> getLatestDonationByDonorId(Long donorId);
    
    /**
     * Get the count of donations by a donor
     * 
     * @param donorId The donor ID to count donations for
     * @return The number of donations by the donor
     */
    Long getDonationCountByDonorId(Long donorId);
    
    /**
     * Delete a blood donation
     * 
     * @param id The ID of the blood donation to delete
     */
    void deleteBloodDonation(Long id);
}