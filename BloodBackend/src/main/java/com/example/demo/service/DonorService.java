package com.example.demo.service;

import com.example.demo.model.Donor;

import java.util.List;
import java.util.Optional;

public interface DonorService {
    
    /**
     * Save a donor
     * 
     * @param donor The donor to save
     * @return The saved donor
     */
    Donor saveDonor(Donor donor);
    
    /**
     * Get a donor by ID
     * 
     * @param id The ID of the donor to retrieve
     * @return An Optional containing the donor if found
     */
    Optional<Donor> getDonorById(Long id);
    
    /**
     * Get a donor by username
     * 
     * @param username The username of the donor to retrieve
     * @return An Optional containing the donor if found
     */
    Optional<Donor> getDonorByUsername(String username);
    
    /**
     * Get a donor by email
     * 
     * @param email The email of the donor to retrieve
     * @return An Optional containing the donor if found
     */
    Optional<Donor> getDonorByEmail(String email);
    
    /**
     * Get all donors
     * 
     * @return A list of all donors
     */
    List<Donor> getAllDonors();
    
    /**
     * Get donors by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of donors with the given blood group
     */
    List<Donor> getDonorsByBloodGroup(String bloodGroup);
    
    /**
     * Get donors by location
     * 
     * @param location The location to search for
     * @return A list of donors in the given location
     */
    List<Donor> getDonorsByLocation(String location);
    
    /**
     * Get donors by availability
     * 
     * @param isAvailable The availability status to search for
     * @return A list of donors with the given availability status
     */
    List<Donor> getDonorsByAvailability(boolean isAvailable);
    
    /**
     * Delete a donor
     * 
     * @param id The ID of the donor to delete
     */
    void deleteDonor(Long id);
    
    /**
     * Authenticate a donor
     * 
     * @param username The username of the donor
     * @param password The password of the donor
     * @return An Optional containing the donor if authentication succeeds
     */
    Optional<Donor> authenticateDonor(String username, String password);
    
    /**
     * Update donor availability
     * 
     * @param id The ID of the donor
     * @param isAvailable The new availability status
     * @return The updated donor if found, otherwise empty Optional
     */
    Optional<Donor> updateDonorAvailability(Long id, boolean isAvailable);
}