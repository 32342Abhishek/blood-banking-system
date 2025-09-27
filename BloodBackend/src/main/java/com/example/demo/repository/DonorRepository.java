package com.example.demo.repository;

import com.example.demo.model.Donor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DonorRepository extends JpaRepository<Donor, Long> {
    
    /**
     * Find a donor by username
     * 
     * @param username The username to search for
     * @return An Optional containing the donor if found
     */
    Optional<Donor> findByUsername(String username);
    
    /**
     * Find a donor by email
     * 
     * @param email The email to search for
     * @return An Optional containing the donor if found
     */
    Optional<Donor> findByEmail(String email);
    
    /**
     * Find donors by blood group
     * 
     * @param bloodGroup The blood group to search for
     * @return A list of donors with the given blood group
     */
    List<Donor> findByBloodGroup(String bloodGroup);
    
    /**
     * Find donors by location
     * 
     * @param location The location to search for
     * @return A list of donors in the given location
     */
    List<Donor> findByLocationContainingIgnoreCase(String location);
    
    /**
     * Find donors by availability status
     * 
     * @param isAvailable The availability status to search for
     * @return A list of donors with the given availability status
     */
    List<Donor> findByIsAvailable(boolean isAvailable);
    
    /**
     * Check if a donor with the given username exists
     * 
     * @param username The username to check
     * @return True if a donor with the username exists, false otherwise
     */
    boolean existsByUsername(String username);
    
    /**
     * Check if a donor with the given email exists
     * 
     * @param email The email to check
     * @return True if a donor with the email exists, false otherwise
     */
    boolean existsByEmail(String email);
}