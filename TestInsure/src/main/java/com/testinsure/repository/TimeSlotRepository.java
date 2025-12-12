package com.testinsure.repository;

import com.testinsure.entity.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Long> {
    // Find all slots for a specific test
    List<TimeSlot> findByLaboratoryTest_TestId(Long testId);
}