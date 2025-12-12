package com.testinsure.controller;

import com.testinsure.entity.TimeSlot;
import com.testinsure.service.TimeSlotService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
public class TimeSlotController {

    private final TimeSlotService timeSlotService;

    public TimeSlotController(TimeSlotService timeSlotService) {
        this.timeSlotService = timeSlotService;
    }

    // 1. Add Slot (Admin Only)
    // URL Example: POST /api/slots?testId=1
    @PostMapping("/slots")
    @PreAuthorize("hasRole('ADMIN')")
    public TimeSlot createSlot(@RequestParam Long testId, @RequestBody TimeSlot slot) {
        return timeSlotService.createSlot(testId, slot);
    }

    // 2. Get Slots for a Test (Public/Patient)
    // URL Example: GET /api/tests/1/slots
    @GetMapping("/tests/{testId}/slots")
    public List<TimeSlot> getSlotsForTest(@PathVariable Long testId) {
        return timeSlotService.getSlotsForTest(testId);
    }
}