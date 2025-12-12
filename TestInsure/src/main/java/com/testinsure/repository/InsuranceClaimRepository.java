package com.testinsure.repository;

import com.testinsure.entity.InsuranceClaim;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsuranceClaimRepository extends JpaRepository<InsuranceClaim, Long> {
    // Find claims for a specific user (via Booking)
    List<InsuranceClaim> findByBooking_User_UserId(Long userId);

    // Find specific claim by booking ID
    java.util.Optional<InsuranceClaim> findByBooking_BookingId(Long bookingId);
}