package com.testinsure;

import com.testinsure.dto.BookingRequest;
import com.testinsure.entity.*;
import com.testinsure.repository.*;
import com.testinsure.service.BookingService;
import com.testinsure.service.InsuranceClaimService;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class BookingServiceLoopholeTest {

    private BookingRepository bookingRepository;
    private UserRepository userRepository;
    private LaboratoryTestRepository testRepository;
    private TimeSlotRepository slotRepository;
    private InsurancePolicyRepository policyRepository;
    private InsuranceClaimRepository claimRepository; 
    
    private BookingService bookingService;
    private InsuranceClaimService claimService;

    @BeforeEach
    public void setup() {
        bookingRepository = mock(BookingRepository.class);
        userRepository = mock(UserRepository.class);
        testRepository = mock(LaboratoryTestRepository.class);
        slotRepository = mock(TimeSlotRepository.class);
        policyRepository = mock(InsurancePolicyRepository.class);
        claimRepository = mock(InsuranceClaimRepository.class);

        bookingService = new BookingService(bookingRepository, userRepository, testRepository, slotRepository, policyRepository, claimRepository);
        claimService = new InsuranceClaimService(claimRepository, bookingRepository);
    }

    @Test
    public void testImmediateDeductionOnBooking() {
        // Setup
        User user = new User(); user.setUserId(1L); user.setEmail("test@test.com");
        LaboratoryTest test = new LaboratoryTest(); test.setTestId(1L); test.setCost(new BigDecimal("400"));
        TimeSlot slot = new TimeSlot(); slot.setSlotId(1L); slot.setCapacity(5);
        InsurancePolicy policy = new InsurancePolicy(); 
        policy.setPolicyId(1L); 
        policy.setCoverageAmount(new BigDecimal("500")); 

        when(userRepository.findByEmail("test@test.com")).thenReturn(Optional.of(user));
        when(testRepository.findById(1L)).thenReturn(Optional.of(test));
        when(slotRepository.findById(1L)).thenReturn(Optional.of(slot));
        when(policyRepository.findById(1L)).thenReturn(Optional.of(policy));
        when(bookingRepository.save(any(Booking.class))).thenAnswer(i -> i.getArguments()[0]);

        // Execute
        BookingRequest request = new BookingRequest();
        request.setTestId(1L);
        request.setSlotId(1L);
        request.setIsInsurance(true);
        request.setPolicyId(1L);

        bookingService.createBooking("test@test.com", request);

        // Verify: Balance should be 100 (500 - 400)
        Assertions.assertEquals(new BigDecimal("100"), policy.getCoverageAmount());
        verify(policyRepository, times(1)).save(policy);
    }

    @Test
    public void testRefundOnRejection() {
        // Setup
        Booking booking = new Booking();
        LaboratoryTest test = new LaboratoryTest();
        test.setCost(new BigDecimal("400"));
        booking.setLaboratoryTest(test);

        InsurancePolicy policy = new InsurancePolicy();
        policy.setCoverageAmount(new BigDecimal("100")); // Assume deducted

        InsuranceClaim claim = new InsuranceClaim();
        claim.setClaimId(1L);
        claim.setBooking(booking);
        claim.setPolicy(policy);
        
        when(claimRepository.findById(1L)).thenReturn(Optional.of(claim));
        when(claimRepository.save(any(InsuranceClaim.class))).thenReturn(claim);

        // Execute
        claimService.rejectClaim(1L, "Invalid reason");

        // Verify: Balance should be 500 (100 + 400)
        Assertions.assertEquals(new BigDecimal("500"), policy.getCoverageAmount());
    }
    
    @Test
    public void testRefundOnCancellation() {
         // Setup
        User user = new User(); user.setEmail("test@test.com");
        Booking booking = new Booking();
        booking.setBookingId(1L);
        booking.setUser(user);
        booking.setPaymentStatus(PaymentStatus.INSURANCE_PENDING);
        LaboratoryTest test = new LaboratoryTest();
        test.setCost(new BigDecimal("400"));
        booking.setLaboratoryTest(test);
        
        InsurancePolicy policy = new InsurancePolicy();
        policy.setCoverageAmount(new BigDecimal("100")); // Assume deducted
        
        InsuranceClaim claim = new InsuranceClaim();
        claim.setPolicy(policy);
        
        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(claimRepository.findByBooking_BookingId(1L)).thenReturn(Optional.of(claim));

        // Execute
        bookingService.cancelBooking(1L, "test@test.com");
        
        // Verify: Balance restored
        Assertions.assertEquals(new BigDecimal("500"), policy.getCoverageAmount());
        verify(policyRepository, times(1)).save(policy);
    }
}
