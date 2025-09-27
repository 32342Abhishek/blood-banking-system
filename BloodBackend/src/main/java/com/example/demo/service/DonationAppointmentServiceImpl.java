package com.example.demo.service;

import com.example.demo.model.DonationAppointment;
import com.example.demo.model.Donor;
import com.example.demo.repository.DonationAppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DonationAppointmentServiceImpl implements DonationAppointmentService {

    private final DonationAppointmentRepository appointmentRepository;

    @Autowired
    public DonationAppointmentServiceImpl(DonationAppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    @Override
    public DonationAppointment saveAppointment(DonationAppointment appointment) {
        // Set creation and update timestamps
        if (appointment.getId() == null) {
            appointment.setCreatedAt(LocalDateTime.now());
            
            // Generate a confirmation code if it doesn't exist
            if (appointment.getConfirmationCode() == null) {
                appointment.setConfirmationCode(generateConfirmationCode());
            }
        }
        appointment.setUpdatedAt(LocalDateTime.now());
        
        return appointmentRepository.save(appointment);
    }

    @Override
    public Optional<DonationAppointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    @Override
    public List<DonationAppointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @Override
    public List<DonationAppointment> getAppointmentsByDonorId(Long donorId) {
        return appointmentRepository.findByDonorId(donorId);
    }

    @Override
    public List<DonationAppointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    @Override
    public List<DonationAppointment> getAppointmentsByLocation(String location) {
        return appointmentRepository.findByLocationContainingIgnoreCase(location);
    }

    @Override
    public List<DonationAppointment> getAppointmentsInDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return appointmentRepository.findByAppointmentDateBetween(startDate, endDate);
    }

    @Override
    public List<DonationAppointment> getAppointmentsForDay(LocalDateTime date) {
        return appointmentRepository.findByAppointmentDateDay(date);
    }

    @Override
    public DonationAppointment scheduleAppointment(Donor donor, LocalDateTime appointmentDate, String location, String notes) {
        DonationAppointment appointment = new DonationAppointment(donor, appointmentDate, location);
        appointment.setNotes(notes);
        appointment.setConfirmationCode(generateConfirmationCode());
        
        return saveAppointment(appointment);
    }

    @Override
    public Optional<DonationAppointment> updateAppointmentStatus(Long id, String status) {
        Optional<DonationAppointment> appointmentOpt = appointmentRepository.findById(id);
        
        if (appointmentOpt.isPresent()) {
            DonationAppointment appointment = appointmentOpt.get();
            appointment.setStatus(status);
            appointment.setUpdatedAt(LocalDateTime.now());
            return Optional.of(appointmentRepository.save(appointment));
        }
        
        return Optional.empty();
    }

    @Override
    public Optional<DonationAppointment> cancelAppointment(Long id) {
        return updateAppointmentStatus(id, "CANCELLED");
    }

    @Override
    public List<DonationAppointment> getUpcomingAppointmentsForDonor(Long donorId) {
        return appointmentRepository.findUpcomingAppointmentsByDonorId(donorId, LocalDateTime.now());
    }

    @Override
    public Optional<DonationAppointment> markReminderSent(Long id) {
        Optional<DonationAppointment> appointmentOpt = appointmentRepository.findById(id);
        
        if (appointmentOpt.isPresent()) {
            DonationAppointment appointment = appointmentOpt.get();
            appointment.setReminderSent(true);
            appointment.setUpdatedAt(LocalDateTime.now());
            return Optional.of(appointmentRepository.save(appointment));
        }
        
        return Optional.empty();
    }

    @Override
    public List<DonationAppointment> getAppointmentsNeedingReminders(int hours) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime reminderWindow = now.plusHours(hours);
        
        return appointmentRepository.findAppointmentsNeedingReminders(now, reminderWindow);
    }

    @Override
    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
    
    /**
     * Generate a random confirmation code
     * 
     * @return A unique confirmation code
     */
    private String generateConfirmationCode() {
        // Generate a random UUID and take the first 8 characters
        return UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}