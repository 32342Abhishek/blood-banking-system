package com.example.demo.service;

import com.example.demo.model.BloodRequest;
import com.example.demo.model.Hospital;

import java.util.List;
import java.util.Optional;

public interface BloodRequestService {
    
    /**
     * Save a blood request
     * 
     * @param bloodRequest The blood request to save
     * @return The saved blood request
     */
    BloodRequest saveBloodRequest(BloodRequest bloodRequest);
    
    /**
     * Get a blood request by ID
     * 
     * @param id The ID of the blood request to retrieve
     * @return An Optional containing the blood request if found
     */
    Optional<BloodRequest> getBloodRequestById(Long id);
    
    /**
     * Get all blood requests
     * 
     * @return A list of all blood requests
     */
    List<BloodRequest> getAllBloodRequests();
    
    /**
     * Get blood requests by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood requests for the given blood group
     */
    List<BloodRequest> getBloodRequestsByBloodGroup(String bloodGroup);
    
    /**
     * Get blood requests by location
     * 
     * @param location The location to search for
     * @return A list of blood requests from the given location
     */
    List<BloodRequest> getBloodRequestsByLocation(String location);
    
    /**
     * Get blood requests by status
     * 
     * @param requestStatus The request status to search for
     * @return A list of blood requests with the given status
     */
    List<BloodRequest> getBloodRequestsByStatus(String requestStatus);
    
    /**
     * Update blood request status
     * 
     * @param id The ID of the blood request
     * @param requestStatus The new request status
     * @return The updated blood request if found, otherwise empty Optional
     */
    Optional<BloodRequest> updateBloodRequestStatus(Long id, String requestStatus);
    
    /**
     * Delete a blood request
     * 
     * @param id The ID of the blood request to delete
     */
    void deleteBloodRequest(Long id);
    
    /**
     * Get blood requests by email
     * 
     * @param email The email to search for
     * @return A list of blood requests from the given email
     */
    List<BloodRequest> getBloodRequestsByEmail(String email);
    
    /**
     * Get blood requests by hospital
     * 
     * @param hospitalId The hospital ID to filter by
     * @return A list of blood requests for the specified hospital
     */
    List<BloodRequest> getBloodRequestsByHospital(Long hospitalId);
    
    /**
     * Get blood requests by priority
     * 
     * @param priority The priority to filter by
     * @return A list of blood requests with the specified priority
     */
    List<BloodRequest> getBloodRequestsByPriority(String priority);
    
    /**
     * Update the units provided for a blood request
     * 
     * @param id The ID of the blood request to update
     * @param unitsProvided The units provided
     * @return The updated blood request if found, otherwise empty Optional
     */
    Optional<BloodRequest> updateUnitsProvided(Long id, Integer unitsProvided);
    
    /**
     * Create a hospital blood request
     * 
     * @param bloodRequest The blood request to create
     * @param hospital The hospital making the request
     * @return The created blood request
     */
    BloodRequest createHospitalRequest(BloodRequest bloodRequest, Hospital hospital);
}