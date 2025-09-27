package com.example.demo.service;

import com.example.demo.model.Hospital;
import java.util.List;
import java.util.Optional;

public interface HospitalService {
    
    List<Hospital> getAllHospitals();
    
    Optional<Hospital> getHospitalById(Long id);
    
    Hospital saveHospital(Hospital hospital);
    
    void deleteHospital(Long id);
    
    List<Hospital> getActiveHospitals();
    
    Optional<Hospital> findByEmail(String email);
    
    Optional<Hospital> findByRegistrationNumber(String registrationNumber);
    
    List<Hospital> searchHospitals(String query);
}