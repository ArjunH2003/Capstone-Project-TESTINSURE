package com.testinsure.service;

import com.testinsure.entity.BookingStatus; // Import
import com.testinsure.entity.LaboratoryTest;
import com.testinsure.entity.TimeSlot;
import com.testinsure.repository.BookingRepository; // Import
import com.testinsure.repository.LaboratoryTestRepository;
import com.testinsure.repository.TimeSlotRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TimeSlotService {

    private final TimeSlotRepository timeSlotRepository;
    private final LaboratoryTestRepository testRepository;
    private final BookingRepository bookingRepository; // Add this

    public TimeSlotService(TimeSlotRepository timeSlotRepository, 
                           LaboratoryTestRepository testRepository,
                           BookingRepository bookingRepository) {
        this.timeSlotRepository = timeSlotRepository;
        this.testRepository = testRepository;
        this.bookingRepository = bookingRepository;
    }

    public TimeSlot createSlot(Long testId, TimeSlot slot) {
        LaboratoryTest test = testRepository.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        slot.setLaboratoryTest(test); 
        return timeSlotRepository.save(slot);
    }

    // FIX: Calculate Remaining Capacity dynamically
    public List<TimeSlot> getSlotsForTest(Long testId) {
        List<TimeSlot> slots = timeSlotRepository.findByLaboratoryTest_TestId(testId);
        
        for (TimeSlot slot : slots) {
            int activeBookings = bookingRepository.countByTimeSlot_SlotIdAndStatusNot(
                    slot.getSlotId(), BookingStatus.CANCELLED);
            
            // We temporarily update the object to show REMAINING capacity to the user
            // (We don't save this to DB, just send it to Frontend)
            int remaining = Math.max(0, slot.getCapacity() - activeBookings);
            slot.setCapacity(remaining); 
        }
        
        return slots;
    }
}