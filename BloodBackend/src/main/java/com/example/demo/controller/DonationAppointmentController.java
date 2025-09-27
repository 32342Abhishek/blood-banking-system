package com.example.demo.controller;

import com.example.demo.model.DonationAppointment;
import com.example.demo.model.Donor;
import com.example.demo.service.DonationAppointmentService;
import com.example.demo.service.DonorService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/appointments")
public class DonationAppointmentController {

    private final DonationAppointmentService appointmentService;
    private final DonorService donorService;

    @Autowired
    public DonationAppointmentController(DonationAppointmentService appointmentService, DonorService donorService) {
        this.appointmentService = appointmentService;
        this.donorService = donorService;
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody DonationAppointment appointment) {
        // Check if the donor exists
        if (appointment.getDonor() == null || appointment.getDonor().getId() == null) {
            return ResponseEntity.badRequest().body("Donor information is required");
        }
        
        Optional<Donor> donorOpt = donorService.getDonorById(appointment.getDonor().getId());
        if (!donorOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }
        
        // Set the donor
        appointment.setDonor(donorOpt.get());
        
        // Save the appointment
        DonationAppointment savedAppointment = appointmentService.saveAppointment(appointment);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedAppointment);
    }

    @PostMapping("/schedule")
    public ResponseEntity<?> scheduleAppointment(
            @RequestParam Long donorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime appointmentDate,
            @RequestParam String location,
            @RequestParam(required = false) String notes) {
        
        Optional<Donor> donorOpt = donorService.getDonorById(donorId);
        if (!donorOpt.isPresent()) {
            return ResponseEntity.badRequest().body("Donor not found");
        }
        
        DonationAppointment appointment = appointmentService.scheduleAppointment(
                donorOpt.get(), appointmentDate, location, notes);
        
        return ResponseEntity.status(HttpStatus.CREATED).body(appointment);
    }

    @GetMapping
    public ResponseEntity<List<DonationAppointment>> getAllAppointments() {
        List<DonationAppointment> appointments = appointmentService.getAllAppointments();
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        Optional<DonationAppointment> appointment = appointmentService.getAppointmentById(id);
        
        if (appointment.isPresent()) {
            return ResponseEntity.ok(appointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/donor/{donorId}")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsByDonorId(@PathVariable Long donorId) {
        List<DonationAppointment> appointments = appointmentService.getAppointmentsByDonorId(donorId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsByStatus(@PathVariable String status) {
        List<DonationAppointment> appointments = appointmentService.getAppointmentsByStatus(status);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsByLocation(@PathVariable String location) {
        List<DonationAppointment> appointments = appointmentService.getAppointmentsByLocation(location);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsInDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        
        List<DonationAppointment> appointments = appointmentService.getAppointmentsInDateRange(startDate, endDate);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/day")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsForDay(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime date) {
        
        List<DonationAppointment> appointments = appointmentService.getAppointmentsForDay(date);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/donor/{donorId}/upcoming")
    public ResponseEntity<List<DonationAppointment>> getUpcomingAppointmentsForDonor(@PathVariable Long donorId) {
        List<DonationAppointment> appointments = appointmentService.getUpcomingAppointmentsForDonor(donorId);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Long id, @RequestParam String status) {
        Optional<DonationAppointment> updatedAppointment = appointmentService.updateAppointmentStatus(id, status);
        
        if (updatedAppointment.isPresent()) {
            return ResponseEntity.ok(updatedAppointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelAppointment(@PathVariable Long id) {
        Optional<DonationAppointment> cancelledAppointment = appointmentService.cancelAppointment(id);
        
        if (cancelledAppointment.isPresent()) {
            return ResponseEntity.ok(cancelledAppointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/reminder")
    public ResponseEntity<?> markReminderSent(@PathVariable Long id) {
        Optional<DonationAppointment> updatedAppointment = appointmentService.markReminderSent(id);
        
        if (updatedAppointment.isPresent()) {
            return ResponseEntity.ok(updatedAppointment.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/reminders/{hours}")
    public ResponseEntity<List<DonationAppointment>> getAppointmentsNeedingReminders(@PathVariable int hours) {
        List<DonationAppointment> appointments = appointmentService.getAppointmentsNeedingReminders(hours);
        return ResponseEntity.ok(appointments);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateAppointment(@PathVariable Long id, @RequestBody DonationAppointment appointment) {
        Optional<DonationAppointment> existingAppointment = appointmentService.getAppointmentById(id);
        
        if (existingAppointment.isPresent()) {
            appointment.setId(id);
            DonationAppointment updatedAppointment = appointmentService.saveAppointment(appointment);
            return ResponseEntity.ok(updatedAppointment);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        Optional<DonationAppointment> existingAppointment = appointmentService.getAppointmentById(id);
        
        if (existingAppointment.isPresent()) {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}