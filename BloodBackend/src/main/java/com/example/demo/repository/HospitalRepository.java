package com.example.demo.repository;

import com.example.demo.model.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HospitalRepository extends JpaRepository<Hospital, Long> {
    
    List<Hospital> findByStatus(String status);
    
    Optional<Hospital> findByEmail(String email);
    
    Optional<Hospital> findByRegistrationNumber(String registrationNumber);
    
    List<Hospital> findByNameContainingIgnoreCase(String name);
}