package com.testinsure.service;

import com.testinsure.entity.Booking;
import com.testinsure.entity.BookingStatus; // Import the Enum
import com.testinsure.entity.Report;
import com.testinsure.entity.User;
import com.testinsure.repository.BookingRepository;
import com.testinsure.repository.ReportRepository;
import com.testinsure.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class ReportService {

    private static final String UPLOAD_DIR = "uploads/";

    private final ReportRepository reportRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

    public Report uploadReport(Long bookingId, MultipartFile file, String adminEmail) throws IOException {
        
        if (file.isEmpty()) {
            throw new RuntimeException("Error: The uploaded file is empty!");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        // 1. Save File
        String fileName = "report_" + bookingId + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());

        // 2. Save Report Entry
        Report report = new Report();
        report.setBooking(booking);
        report.setFileUrl(filePath.toString());
        report.setUploadedByAdmin(admin);
        
        // --- THE FIX: AUTO-COMPLETE BOOKING ---
        // This removes the "Cancel" button on the frontend
        booking.setStatus(BookingStatus.COMPLETED);
        bookingRepository.save(booking);
        // --------------------------------------

        return reportRepository.save(report);
    }

    public Report getReportByBooking(Long bookingId) {
        return reportRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Report not found for this booking"));
    }
}