package com.example.demo.service;

import com.example.demo.model.BloodDonation;
import com.example.demo.model.BloodInventory;
import com.example.demo.model.Donor;
import com.example.demo.repository.BloodDonationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BloodDonationServiceImpl implements BloodDonationService {

    private final BloodDonationRepository bloodDonationRepository;
    private final BloodInventoryService bloodInventoryService;
    private final DonorService donorService;

    @Autowired
    public BloodDonationServiceImpl(
            BloodDonationRepository bloodDonationRepository,
            BloodInventoryService bloodInventoryService,
            DonorService donorService) {
        this.bloodDonationRepository = bloodDonationRepository;
        this.bloodInventoryService = bloodInventoryService;
        this.donorService = donorService;
    }

    @Override
    public BloodDonation saveBloodDonation(BloodDonation bloodDonation) {
        // Set creation and update timestamps
        if (bloodDonation.getId() == null) {
            bloodDonation.setCreatedAt(LocalDateTime.now());
        }
        bloodDonation.setUpdatedAt(LocalDateTime.now());
        
        return bloodDonationRepository.save(bloodDonation);
    }

    @Override
    public Optional<BloodDonation> getBloodDonationById(Long id) {
        return bloodDonationRepository.findById(id);
    }

    @Override
    public List<BloodDonation> getAllBloodDonations() {
        return bloodDonationRepository.findAll();
    }

    @Override
    public List<BloodDonation> getBloodDonationsByDonorId(Long donorId) {
        return bloodDonationRepository.findByDonorId(donorId);
    }

    @Override
    public List<BloodDonation> getBloodDonationsByBloodGroup(String bloodGroup) {
        return bloodDonationRepository.findByBloodGroup(bloodGroup);
    }

    @Override
    public List<BloodDonation> getBloodDonationsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return bloodDonationRepository.findByDonationDateBetween(startDate, endDate);
    }

    @Override
    @Transactional
    public BloodDonation recordDonation(Donor donor, Integer quantityMl, String healthStatus, String notes) {
        // Create the donation record
        BloodDonation donation = new BloodDonation();
        donation.setDonor(donor);
        donation.setBloodGroup(donor.getBloodGroup());
        donation.setQuantityMl(quantityMl);
        donation.setDonationDate(LocalDateTime.now());
        donation.setHealthStatus(healthStatus);
        donation.setNotes(notes);
        
        // Save the donation
        BloodDonation savedDonation = saveBloodDonation(donation);
        
        // Update the donor's last donation date
        donor.setLastDonation(LocalDateTime.now());
        donorService.saveDonor(donor);
        
        // If the donation is healthy, add it to inventory
        if ("NORMAL".equals(healthStatus)) {
            // Standard blood unit is about 450ml, calculate how many units this donation represents
            int units = quantityMl / 450;
            if (units > 0) {
                BloodInventory inventory = new BloodInventory();
                inventory.setBloodGroup(donor.getBloodGroup());
                inventory.setUnits(units);
                inventory.setDonationId(savedDonation.getId());
                inventory.setStatus("AVAILABLE");
                
                // Blood typically expires in 42 days
                inventory.setExpiryDate(LocalDateTime.now().plusDays(42));
                
                bloodInventoryService.saveBloodInventory(inventory);
            }
        }
        
        return savedDonation;
    }

    @Override
    public Optional<BloodDonation> getLatestDonationByDonorId(Long donorId) {
        List<BloodDonation> donations = bloodDonationRepository.findLatestDonationByDonorId(donorId);
        return donations.isEmpty() ? Optional.empty() : Optional.of(donations.get(0));
    }

    @Override
    public Long getDonationCountByDonorId(Long donorId) {
        return bloodDonationRepository.countByDonorId(donorId);
    }

    @Override
    public void deleteBloodDonation(Long id) {
        bloodDonationRepository.deleteById(id);
    }
}