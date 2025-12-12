package com.testinsure.controller;

import com.testinsure.entity.Report;
import com.testinsure.service.ReportService;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // 1. Upload Report (Admin Only)
    // Consumes "multipart/form-data"
    @PostMapping("/upload")
    public Report uploadReport(@RequestParam("bookingId") Long bookingId,
                               @RequestParam("file") MultipartFile file,
                               Principal principal) throws IOException {
        return reportService.uploadReport(bookingId, file, principal.getName());
    }

 // 2. Download Report (Smart Version)
    @GetMapping("/download/{bookingId}")
    public ResponseEntity<Resource> downloadReport(@PathVariable Long bookingId) throws IOException {
        Report report = reportService.getReportByBooking(bookingId);
        File file = new File(report.getFileUrl());

        if (!file.exists()) {
            throw new RuntimeException("File not found on server");
        }

        Resource resource = new FileSystemResource(file);
        
        // Detect the file type dynamically (PDF, TXT, PNG, etc.)
        String contentType = java.nio.file.Files.probeContentType(file.toPath());
        if (contentType == null) {
            contentType = "application/octet-stream"; // Default to generic download
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() + "\"")
                .body(resource);
    }
}