package com.testinsure.service;

import com.testinsure.dto.BookingRequest;
import com.testinsure.entity.*;
import com.testinsure.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BookingService {
	
	/*Methods :
	 * 1)Create Booking
	 * 2)Cancel Booking(Includes Refund)
	 * 3)Get my Bookings(Patient)
	 * 4)Get all Bookings(Admin)
	 */

    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final LaboratoryTestRepository testRepository;
    private final TimeSlotRepository slotRepository;
    private final InsurancePolicyRepository policyRepository;
    private final InsuranceClaimRepository claimRepository;

    public BookingService(BookingRepository bookingRepository, UserRepository userRepository,
                          LaboratoryTestRepository testRepository, TimeSlotRepository slotRepository,
                          InsurancePolicyRepository policyRepository, InsuranceClaimRepository claimRepository) {
        this.bookingRepository = bookingRepository;
        this.userRepository = userRepository;
        this.testRepository = testRepository;
        this.slotRepository = slotRepository;
        this.policyRepository = policyRepository;
        this.claimRepository = claimRepository;
    }

    @Transactional
    public Booking createBooking(String userEmail, BookingRequest request) {
        
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LaboratoryTest test = testRepository.findById(request.getTestId())
                .orElseThrow(() -> new RuntimeException("Test not found"));

        TimeSlot slot = slotRepository.findById(request.getSlotId())
                .orElseThrow(() -> new RuntimeException("Slot not found"));

        // FIX 1: Allow re-booking if the previous one was CANCELLED
        if (bookingRepository.existsByUser_UserIdAndTimeSlot_SlotIdAndStatusNot(
                user.getUserId(), slot.getSlotId(), BookingStatus.CANCELLED)) {
            throw new RuntimeException("You have already booked this time slot!");
        }

        // FIX 2: Check REAL Capacity (Total - Active Bookings)
        int activeBookings = bookingRepository.countByTimeSlot_SlotIdAndStatusNot(slot.getSlotId(), BookingStatus.CANCELLED);
        if (activeBookings >= slot.getCapacity()) {
            throw new RuntimeException("Slot is fully booked.");
        }

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setLaboratoryTest(test);
        booking.setTimeSlot(slot);
        booking.setStatus(BookingStatus.CONFIRMED); 

        if (request.getIsInsurance()) {
            // INSURANCE FLOW
            booking.setPaymentStatus(PaymentStatus.INSURANCE_PENDING);
            
            if (request.getPolicyId() == null) throw new RuntimeException("Policy ID required");
            
            InsurancePolicy policy = policyRepository.findById(request.getPolicyId())
                    .orElseThrow(() -> new RuntimeException("Policy not found"));

            // Check Balance
            if (policy.getCoverageAmount().compareTo(test.getCost()) < 0) {
                throw new RuntimeException("Insufficient Insurance Coverage! Remaining: " + policy.getCoverageAmount());
            }

            // FIX: Deduct Immediately
            policy.setCoverageAmount(policy.getCoverageAmount().subtract(test.getCost()));
            policyRepository.save(policy);

            booking = bookingRepository.save(booking);

            InsuranceClaim claim = new InsuranceClaim();
            claim.setBooking(booking);
            claim.setPolicy(policy);
            claim.setStatus(ClaimStatus.PENDING);
            claim.setRemarks("Auto-generated claim");
            claimRepository.save(claim);

        } else {
            // CARD / CASH FLOW (FIX: Mark PAID immediately)
            // Since frontend simulated the card entry, we treat this as successful.
            booking.setPaymentStatus(PaymentStatus.PAID);
            booking = bookingRepository.save(booking);
        }

        return booking;
    }

    // Cancel Booking
    public void cancelBooking(Long bookingId, String userEmail) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        
        // Ensure the user owns this booking
        if (!booking.getUser().getEmail().equals(userEmail)) {
            throw new RuntimeException("Unauthorized cancellation");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        // FIX: Refund if insurance was used
        if (booking.getPaymentStatus() == PaymentStatus.INSURANCE_PENDING || booking.getPaymentStatus() == PaymentStatus.PAID) {
            java.util.Optional<InsuranceClaim> claimOpt = claimRepository.findByBooking_BookingId(bookingId);
            if (claimOpt.isPresent()) {
                InsuranceClaim claim = claimOpt.get();
                InsurancePolicy policy = claim.getPolicy();
                policy.setCoverageAmount(policy.getCoverageAmount().add(booking.getLaboratoryTest().getCost()));
                policyRepository.save(policy);
                
                claim.setStatus(ClaimStatus.REJECTED);
                claimRepository.save(claim);
            }
        }
    }

    // Get My Bookings (Patient)
    public List<Booking> getUserBookings(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUser_UserId(user.getUserId());
    }
    
 // 5. Get All Bookings (Admin Only) - FILTERED
    public List<Booking> getAllBookings() {
        // Only return bookings that are NOT Cancelled.
        // This hides rejected claims and user-cancelled bookings from the Admin Report list.
        return bookingRepository.findByStatusNot(BookingStatus.CANCELLED);
    }

    // Process Payment (Optional utility if needed later)
    public Booking processPayment(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        if (booking.getPaymentStatus() == PaymentStatus.PAID) {
            throw new RuntimeException("Booking is already paid.");
        }

        booking.setPaymentStatus(PaymentStatus.PAID);
        return bookingRepository.save(booking);
    }
}