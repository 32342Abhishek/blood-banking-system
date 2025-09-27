package com.example.demo.service;

import com.example.demo.model.BloodRequest;
import com.example.demo.model.Hospital;
import com.example.demo.repository.BloodRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BloodRequestServiceImpl implements BloodRequestService {

    private final BloodRequestRepository bloodRequestRepository;

    @Autowired
    public BloodRequestServiceImpl(BloodRequestRepository bloodRequestRepository) {
        this.bloodRequestRepository = bloodRequestRepository;
    }

    @Override
    public BloodRequest saveBloodRequest(BloodRequest bloodRequest) {
        // Set creation and update timestamps
        if (bloodRequest.getId() == null) {
            bloodRequest.setCreatedAt(LocalDateTime.now());
        }
        bloodRequest.setUpdatedAt(LocalDateTime.now());
        
        return bloodRequestRepository.save(bloodRequest);
    }

    @Override
    public Optional<BloodRequest> getBloodRequestById(Long id) {
        return bloodRequestRepository.findById(id);
    }

    @Override
    public List<BloodRequest> getAllBloodRequests() {
        return bloodRequestRepository.findAll();
    }

    @Override
    public List<BloodRequest> getBloodRequestsByBloodGroup(String bloodGroup) {
        return bloodRequestRepository.findByBloodGroup(bloodGroup);
    }

    @Override
    public List<BloodRequest> getBloodRequestsByLocation(String location) {
        return bloodRequestRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<BloodRequest> getBloodRequestsByStatus(String requestStatus) {
        return bloodRequestRepository.findByRequestStatus(requestStatus);
    }

    @Override
    public Optional<BloodRequest> updateBloodRequestStatus(Long id, String requestStatus) {
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(id);
        
        if (requestOpt.isPresent()) {
            BloodRequest bloodRequest = requestOpt.get();
            bloodRequest.setRequestStatus(requestStatus);
            bloodRequest.setUpdatedAt(LocalDateTime.now());
            return Optional.of(bloodRequestRepository.save(bloodRequest));
        }
        
        return Optional.empty();
    }

    @Override
    public void deleteBloodRequest(Long id) {
        bloodRequestRepository.deleteById(id);
    }

    @Override
    public List<BloodRequest> getBloodRequestsByEmail(String email) {
        return bloodRequestRepository.findByEmail(email);
    }
    
    @Override
    public List<BloodRequest> getBloodRequestsByHospital(Long hospitalId) {
        return bloodRequestRepository.findByHospital_Id(hospitalId);
    }
    
    @Override
    public List<BloodRequest> getBloodRequestsByPriority(String priority) {
        return bloodRequestRepository.findByPriority(priority);
    }
    
    @Override
    public Optional<BloodRequest> updateUnitsProvided(Long id, Integer unitsProvided) {
        Optional<BloodRequest> requestOpt = bloodRequestRepository.findById(id);
        
        if (requestOpt.isPresent()) {
            BloodRequest bloodRequest = requestOpt.get();
            bloodRequest.setUnitsProvided(unitsProvided);
            
            // Update status based on units provided vs units needed
            if (unitsProvided >= bloodRequest.getUnitsNeeded()) {
                bloodRequest.setRequestStatus("FULFILLED");
            } else if (unitsProvided > 0) {
                bloodRequest.setRequestStatus("PARTIAL");
            }
            
            bloodRequest.setUpdatedAt(LocalDateTime.now());
            return Optional.of(bloodRequestRepository.save(bloodRequest));
        }
        
        return Optional.empty();
    }
    
    @Override
    public BloodRequest createHospitalRequest(BloodRequest bloodRequest, Hospital hospital) {
        bloodRequest.setHospital(hospital);
        
        if (bloodRequest.getRequiredBy() == null) {
            // Default to 24 hours from now if not specified
            bloodRequest.setRequiredBy(LocalDateTime.now().plusHours(24));
        }
        
        return saveBloodRequest(bloodRequest);
    }
}