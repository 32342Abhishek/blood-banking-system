package com.example.demo.service;

import com.example.demo.model.Hospital;
import com.example.demo.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class HospitalServiceImpl implements HospitalService {

    private final HospitalRepository hospitalRepository;

    @Autowired
    public HospitalServiceImpl(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    @Override
    public List<Hospital> getAllHospitals() {
        return hospitalRepository.findAll();
    }

    @Override
    public Optional<Hospital> getHospitalById(Long id) {
        return hospitalRepository.findById(id);
    }

    @Override
    public Hospital saveHospital(Hospital hospital) {
        if (hospital.getId() == null) {
            hospital.setCreatedAt(LocalDateTime.now());
        }
        hospital.setUpdatedAt(LocalDateTime.now());
        return hospitalRepository.save(hospital);
    }

    @Override
    public void deleteHospital(Long id) {
        hospitalRepository.deleteById(id);
    }

    @Override
    public List<Hospital> getActiveHospitals() {
        return hospitalRepository.findByStatus("ACTIVE");
    }

    @Override
    public Optional<Hospital> findByEmail(String email) {
        return hospitalRepository.findByEmail(email);
    }

    @Override
    public Optional<Hospital> findByRegistrationNumber(String registrationNumber) {
        return hospitalRepository.findByRegistrationNumber(registrationNumber);
    }

    @Override
    public List<Hospital> searchHospitals(String query) {
        return hospitalRepository.findByNameContainingIgnoreCase(query);
    }
}