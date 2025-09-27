package com.example.demo.repository;

import com.example.demo.model.BloodRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BloodRequestRepository extends JpaRepository<BloodRequest, Long> {
    
    /**
     * Find blood requests by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of blood requests for the given blood group
     */
    List<BloodRequest> findByBloodGroup(String bloodGroup);
    
    /**
     * Find blood requests by request status
     * 
     * @param requestStatus The request status to search for
     * @return A list of blood requests with the given status
     */
    List<BloodRequest> findByRequestStatus(String requestStatus);
    
    /**
     * Find blood requests by location
     * 
     * @param location The location to search for
     * @return A list of blood requests from the given location
     */
    List<BloodRequest> findByLocationContainingIgnoreCase(String location);
    
    /**
     * Find blood requests by email
     * 
     * @param email The email to search for
     * @return A list of blood requests from the given email
     */
    List<BloodRequest> findByEmail(String email);
    
    /**
     * Find blood requests by hospital
     * 
     * @param hospital_id The hospital ID to filter by
     * @return A list of blood requests for the specified hospital
     */
    List<BloodRequest> findByHospital_Id(Long hospital_id);
    
    /**
     * Find blood requests by priority
     * 
     * @param priority The priority to filter by
     * @return A list of blood requests with the specified priority
     */
    List<BloodRequest> findByPriority(String priority);
}