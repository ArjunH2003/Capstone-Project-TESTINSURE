package com.testinsure.repository;

import com.testinsure.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ReportRepository extends JpaRepository<Report, Long> {
    // Find report by booking ID
    Optional<Report> findByBooking_BookingId(Long bookingId);
}