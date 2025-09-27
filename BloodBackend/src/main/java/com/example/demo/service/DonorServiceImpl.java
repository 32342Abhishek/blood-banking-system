package com.example.demo.service;

import com.example.demo.model.Donor;
import com.example.demo.repository.DonorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DonorServiceImpl implements DonorService {

    private final DonorRepository donorRepository;

    @Autowired
    public DonorServiceImpl(DonorRepository donorRepository) {
        this.donorRepository = donorRepository;
    }

    @Override
    public Donor saveDonor(Donor donor) {
        // Set creation and update timestamps
        if (donor.getId() == null) {
            donor.setCreatedAt(LocalDateTime.now());
        }
        donor.setUpdatedAt(LocalDateTime.now());
        
        return donorRepository.save(donor);
    }

    @Override
    public Optional<Donor> getDonorById(Long id) {
        return donorRepository.findById(id);
    }

    @Override
    public Optional<Donor> getDonorByUsername(String username) {
        return donorRepository.findByUsername(username);
    }

    @Override
    public Optional<Donor> getDonorByEmail(String email) {
        return donorRepository.findByEmail(email);
    }

    @Override
    public List<Donor> getAllDonors() {
        return donorRepository.findAll();
    }

    @Override
    public List<Donor> getDonorsByBloodGroup(String bloodGroup) {
        return donorRepository.findByBloodGroup(bloodGroup);
    }

    @Override
    public List<Donor> getDonorsByLocation(String location) {
        return donorRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<Donor> getDonorsByAvailability(boolean isAvailable) {
        return donorRepository.findByIsAvailable(isAvailable);
    }

    @Override
    public void deleteDonor(Long id) {
        donorRepository.deleteById(id);
    }

    @Override
    public Optional<Donor> authenticateDonor(String username, String password) {
        Optional<Donor> donorOpt = donorRepository.findByUsername(username);
        
        if (donorOpt.isPresent()) {
            Donor donor = donorOpt.get();
            // For a real application, you should use proper password encoding
            if (donor.getPassword().equals(password)) {
                return donorOpt;
            }
        }
        
        return Optional.empty();
    }

    @Override
    public Optional<Donor> updateDonorAvailability(Long id, boolean isAvailable) {
        Optional<Donor> donorOpt = donorRepository.findById(id);
        
        if (donorOpt.isPresent()) {
            Donor donor = donorOpt.get();
            donor.setAvailable(isAvailable);
            donor.setUpdatedAt(LocalDateTime.now());
            return Optional.of(donorRepository.save(donor));
        }
        
        return Optional.empty();
    }
}