package com.testinsure.service;

import com.testinsure.entity.Booking;
import com.testinsure.entity.BookingStatus;
import com.testinsure.entity.ClaimStatus;
import com.testinsure.entity.InsuranceClaim;
import com.testinsure.entity.InsurancePolicy;
import com.testinsure.entity.PaymentStatus;
import com.testinsure.repository.BookingRepository;
import com.testinsure.repository.InsuranceClaimRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InsuranceClaimService {

    private final InsuranceClaimRepository claimRepository;
    private final BookingRepository bookingRepository;

    public InsuranceClaimService(InsuranceClaimRepository claimRepository, BookingRepository bookingRepository) {
        this.claimRepository = claimRepository;
        this.bookingRepository = bookingRepository;
    }

    public List<InsuranceClaim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Transactional
    public InsuranceClaim approveClaim(Long claimId) {
        InsuranceClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        java.math.BigDecimal testCost = claim.getBooking().getLaboratoryTest().getCost();
        InsurancePolicy policy = claim.getPolicy();

        // Double check balance
        if (policy.getCoverageAmount().compareTo(testCost) < 0) {
            throw new RuntimeException("Insufficient funds in policy to approve this claim.");
        }

        // FIXED: Balance already deducted at booking time.
        // policy.setCoverageAmount(policy.getCoverageAmount().subtract(testCost));
        // (Since 'policy' is a managed entity in @Transactional, JPA usually saves it auto, 
        // but let's be safe if your setup varies).
        
        claim.setStatus(ClaimStatus.APPROVED);
        claim.setResolvedAt(LocalDateTime.now());
        claim.setApprovedAmount(testCost);
        
        Booking booking = claim.getBooking();
        booking.setPaymentStatus(PaymentStatus.PAID); 
        bookingRepository.save(booking);

        return claimRepository.save(claim);
    }

    @Transactional
    public InsuranceClaim rejectClaim(Long claimId, String reason) { // <--- Must accept String reason
        InsuranceClaim claim = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        claim.setStatus(ClaimStatus.REJECTED);
        claim.setResolvedAt(LocalDateTime.now());
        claim.setRemarks(reason); // Save the remark

        if (reason != null && reason.toLowerCase().contains("invalid insurance")) {
            InsurancePolicy policy = claim.getPolicy();
            policy.setStatus(com.testinsure.entity.PolicyStatus.BLOCKED);
        }

        // FIX: Refund balance on rejection
        InsurancePolicy policy = claim.getPolicy();
        java.math.BigDecimal testCost = claim.getBooking().getLaboratoryTest().getCost();
        policy.setCoverageAmount(policy.getCoverageAmount().add(testCost));
        // policyRepository.save(policy); // Managed entity, auto-saved

        // Cancel the booking so the slot opens up
        Booking booking = claim.getBooking();
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setStatus(BookingStatus.CANCELLED); 
        bookingRepository.save(booking);

        return claimRepository.save(claim);
    }
    }
