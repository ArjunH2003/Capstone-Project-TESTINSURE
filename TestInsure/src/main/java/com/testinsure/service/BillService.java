package com.testinsure.service;

import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfWriter;
import com.testinsure.entity.Booking;
import com.testinsure.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;

@Service
public class BillService {

    private final BookingRepository bookingRepository;

    public BillService(BookingRepository bookingRepository) {
        this.bookingRepository = bookingRepository;
    }

    public ByteArrayInputStream generateBill(Long bookingId) {
        // 1. Fetch Booking Data
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // 2. Create PDF Document
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // 3. Add Header (Hospital Name)
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Paragraph header = new Paragraph("TestInsure Diagnostic Center", headerFont);
            header.setAlignment(Element.ALIGN_CENTER);
            document.add(header);
            
            document.add(new Paragraph(" ")); // Empty line

            // 4. Add "Invoice" Title
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Paragraph title = new Paragraph("BOOKING RECEIPT", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            document.add(new Paragraph("-----------------------------------------------------------------------"));

            // 5. Add Details
            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            
            document.add(new Paragraph("Booking ID: " + booking.getBookingId(), bodyFont));
            document.add(new Paragraph("Date: " + booking.getCreatedAt().toLocalDate(), bodyFont));
            document.add(new Paragraph("Patient Name: " + booking.getUser().getName(), bodyFont));
            document.add(new Paragraph("Patient Email: " + booking.getUser().getEmail(), bodyFont));
            
            document.add(new Paragraph(" ")); 

            // 6. Test Details Section
            document.add(new Paragraph("Test Name: " + booking.getLaboratoryTest().getName(), bodyFont));
            document.add(new Paragraph("Description: " + booking.getLaboratoryTest().getDescription(), bodyFont));
            document.add(new Paragraph("Appointment Date: " + booking.getTimeSlot().getDate(), bodyFont));
            document.add(new Paragraph("Time: " + booking.getTimeSlot().getStartTime() + " - " + booking.getTimeSlot().getEndTime(), bodyFont));

            document.add(new Paragraph("-----------------------------------------------------------------------"));

            // 7. Payment Section
            Font amountFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);
            document.add(new Paragraph("Total Amount: $" + booking.getLaboratoryTest().getCost(), amountFont));
            document.add(new Paragraph("Payment Status: " + booking.getPaymentStatus(), amountFont));

            // Footer
            document.add(new Paragraph(" ")); 
            document.add(new Paragraph("Thank you for choosing TestInsure.", FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10)));

            document.close();

        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}