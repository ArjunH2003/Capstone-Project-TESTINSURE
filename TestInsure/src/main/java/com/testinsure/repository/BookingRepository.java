package com.testinsure.repository;

import com.testinsure.entity.Booking;
import com.testinsure.entity.BookingStatus;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find all bookings made by a specific user (for Patient Dashboard)
    List<Booking> findByUser_UserId(Long userId);
    
    // Find bookings for a specific slot (to check capacity)
    List<Booking> findByTimeSlot_SlotId(Long slotId);
    
 // FIX 1: Check duplicate booking ONLY if status is NOT Cancelled
    boolean existsByUser_UserIdAndTimeSlot_SlotIdAndStatusNot(Long userId, Long slotId, BookingStatus status);

    // FIX 2: Count how many people have booked a slot (Ignoring Cancelled)
    int countByTimeSlot_SlotIdAndStatusNot(Long slotId, BookingStatus status);
    
 // Fetch all bookings where status is NOT 'CANCELLED'
    List<Booking> findByStatusNot(com.testinsure.entity.BookingStatus status);
}
