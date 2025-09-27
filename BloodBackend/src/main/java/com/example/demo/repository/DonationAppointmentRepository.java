package com.example.demo.repository;

import com.example.demo.model.DonationAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonationAppointmentRepository extends JpaRepository<DonationAppointment, Long> {
    
    /**
     * Find appointments by donor ID
     * 
     * @param donorId The donor ID to search for
     * @return A list of appointments for the given donor
     */
    @Query("SELECT a FROM DonationAppointment a WHERE a.donor.id = ?1")
    List<DonationAppointment> findByDonorId(Long donorId);
    
    /**
     * Find appointments by status
     * 
     * @param status The status to search for
     * @return A list of appointments with the given status
     */
    List<DonationAppointment> findByStatus(String status);
    
    /**
     * Find appointments by location
     * 
     * @param location The location to search for
     * @return A list of appointments at the given location
     */
    List<DonationAppointment> findByLocationContainingIgnoreCase(String location);
    
    /**
     * Find appointments within a date range
     * 
     * @param startDate The start date of the range
     * @param endDate The end date of the range
     * @return A list of appointments within the given date range
     */
    List<DonationAppointment> findByAppointmentDateBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    /**
     * Find appointments for a given date
     * 
     * @param date The date to search for
     * @return A list of appointments on the given date
     */
    @Query("SELECT a FROM DonationAppointment a WHERE YEAR(a.appointmentDate) = YEAR(?1) AND MONTH(a.appointmentDate) = MONTH(?1) AND DAY(a.appointmentDate) = DAY(?1)")
    List<DonationAppointment> findByAppointmentDateDay(LocalDateTime date);
    
    /**
     * Find upcoming appointments for a donor
     * 
     * @param donorId The donor ID to search for
     * @param now The current date and time
     * @return A list of upcoming appointments for the donor
     */
    @Query("SELECT a FROM DonationAppointment a WHERE a.donor.id = ?1 AND a.appointmentDate > ?2 AND a.status = 'SCHEDULED' ORDER BY a.appointmentDate ASC")
    List<DonationAppointment> findUpcomingAppointmentsByDonorId(Long donorId, LocalDateTime now);
    
    /**
     * Find appointments that need reminders
     * 
     * @param startTime The start time for reminder window
     * @param endTime The end time for reminder window
     * @return A list of appointments needing reminders
     */
    @Query("SELECT a FROM DonationAppointment a WHERE a.appointmentDate BETWEEN ?1 AND ?2 AND a.reminderSent = false AND a.status = 'SCHEDULED'")
    List<DonationAppointment> findAppointmentsNeedingReminders(LocalDateTime startTime, LocalDateTime endTime);
}