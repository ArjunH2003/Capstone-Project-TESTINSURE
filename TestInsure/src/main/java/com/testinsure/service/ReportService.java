package com.testinsure.service;

import com.testinsure.entity.Booking;
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

    // The folder where files will be stored locally
    private static final String UPLOAD_DIR = "uploads/";

    private final ReportRepository reportRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    public ReportService(ReportRepository reportRepository, BookingRepository bookingRepository, UserRepository userRepository) {
        this.reportRepository = reportRepository;
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        
        // Automatically create the 'uploads' folder if it doesn't exist
        File directory = new File(UPLOAD_DIR);
        if (!directory.exists()) {
            directory.mkdirs();
        }
    }

 // 1. Upload Logic (Debug Version)
    public Report uploadReport(Long bookingId, MultipartFile file, String adminEmail) throws IOException {
        
        // --- SPY: Print the file size ---
        System.out.println("--- DEBUG: UPLOAD STARTED ---");
        System.out.println("--- DEBUG: Received File Name: " + file.getOriginalFilename());
        System.out.println("--- DEBUG: Received File Size: " + file.getSize() + " bytes");
        // -------------------------------

        if (file.isEmpty()) {
            throw new RuntimeException("Error: The uploaded file is empty!");
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        String fileName = "report_" + bookingId + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        
        Files.write(filePath, file.getBytes());

        System.out.println("--- DEBUG: File successfully written to: " + filePath.toAbsolutePath());

        Report report = new Report();
        report.setBooking(booking);
        report.setFileUrl(filePath.toString());
        report.setUploadedByAdmin(admin);
        
        return reportRepository.save(report);
    }

    // 2. Download Logic
    public Report getReportByBooking(Long bookingId) {
        return reportRepository.findByBooking_BookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Report not found for this booking"));
    }
}