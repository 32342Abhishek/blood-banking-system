package com.example.demo.service;

import com.example.demo.model.DonationAppointment;
import com.example.demo.model.Donor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface DonationAppointmentService {
    
    /**
     * Save an appointment
     * 
     * @param appointment The appointment to save
     * @return The saved appointment
     */
    DonationAppointment saveAppointment(DonationAppointment appointment);
    
    /**
     * Get an appointment by ID
     * 
     * @param id The ID of the appointment to retrieve
     * @return An Optional containing the appointment if found
     */
    Optional<DonationAppointment> getAppointmentById(Long id);
    
    /**
     * Get all appointments
     * 
     * @return A list of all appointments
     */
    List<DonationAppointment> getAllAppointments();
    
    /**
     * Get appointments by donor ID
     * 
     * @param donorId The donor ID to search for
     * @return A list of appointments for the given donor
     */
    List<DonationAppointment> getAppointmentsByDonorId(Long donorId);
    
    /**
     * Get appointments by status
     * 
     * @param status The status to search for
     * @return A list of appointments with the given status
     */
    List<DonationAppointment> getAppointmentsByStatus(String status);
    
    /**
     * Get appointments by location
     * 
     * @param location The location to search for
     * @return A list of appointments at the given location
     */
    List<DonationAppointment> getAppointmentsByLocation(String location);
    
    /**
     * Get appointments within a date range
     * 
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return A list of appointments within the given date range
     */
    List<DonationAppointment> getAppointmentsInDateRange(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Get appointments for a specific day
     * 
     * @param date The date to search for
     * @return A list of appointments on the given day
     */
    List<DonationAppointment> getAppointmentsForDay(LocalDateTime date);
    
    /**
     * Schedule a new appointment
     * 
     * @param donor The donor for the appointment
     * @param appointmentDate The date and time of the appointment
     * @param location The location of the appointment
     * @param notes Any additional notes
     * @return The new appointment
     */
    DonationAppointment scheduleAppointment(Donor donor, LocalDateTime appointmentDate, String location, String notes);
    
    /**
     * Update appointment status
     * 
     * @param id The ID of the appointment
     * @param status The new status
     * @return The updated appointment if found, otherwise empty Optional
     */
    Optional<DonationAppointment> updateAppointmentStatus(Long id, String status);
    
    /**
     * Cancel an appointment
     * 
     * @param id The ID of the appointment to cancel
     * @return The cancelled appointment if found, otherwise empty Optional
     */
    Optional<DonationAppointment> cancelAppointment(Long id);
    
    /**
     * Get upcoming appointments for a donor
     * 
     * @param donorId The donor ID to search for
     * @return A list of upcoming appointments for the donor
     */
    List<DonationAppointment> getUpcomingAppointmentsForDonor(Long donorId);
    
    /**
     * Mark appointment reminder as sent
     * 
     * @param id The ID of the appointment
     * @return The updated appointment if found, otherwise empty Optional
     */
    Optional<DonationAppointment> markReminderSent(Long id);
    
    /**
     * Find appointments needing reminders
     * 
     * @param hours The number of hours before the appointment to send reminders
     * @return A list of appointments needing reminders
     */
    List<DonationAppointment> getAppointmentsNeedingReminders(int hours);
    
    /**
     * Delete an appointment
     * 
     * @param id The ID of the appointment to delete
     */
    void deleteAppointment(Long id);
}