package com.testinsure.controller;

import com.testinsure.dto.BookingRequest;
import com.testinsure.entity.Booking;
import com.testinsure.service.BillService;
import com.testinsure.service.BookingService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final BillService billService;

    public BookingController(BookingService bookingService, BillService billService) {
        this.bookingService = bookingService;
        this.billService = billService;
    }

    // 1. Create Booking
    @PostMapping
    public Booking createBooking(@RequestBody BookingRequest request, Principal principal) {
        return bookingService.createBooking(principal.getName(), request);
    }

    // 2. View My Bookings
    @GetMapping("/my")
    public List<Booking> getMyBookings(Principal principal) {
        return bookingService.getUserBookings(principal.getName());
    }

    // 3. Download Bill
    @GetMapping("/{id}/bill")
    public ResponseEntity<InputStreamResource> downloadBill(@PathVariable Long id) {
        ByteArrayInputStream pdf = billService.generateBill(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=bill_" + id + ".pdf");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_PDF)
                .body(new InputStreamResource(pdf));
    }

    // 4. Process Payment (NEW - Calling Service)
    @PutMapping("/{id}/pay")
    public Booking processPayment(@PathVariable Long id) {
        return bookingService.processPayment(id);
    }
    
 // 5. Get All Bookings (Admin Only)
    @GetMapping("/all")
    // @PreAuthorize("hasRole('ADMIN')") // Uncomment if using security strictly
    public List<Booking> getAllBookings() {
        return bookingService.getAllBookings();
    }
    
 // 6. Cancel Booking
    @PutMapping("/{id}/cancel")
    public void cancelBooking(@PathVariable Long id, Principal principal) {
        bookingService.cancelBooking(id, principal.getName());
    }
}