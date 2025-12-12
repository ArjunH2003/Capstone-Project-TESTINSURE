package com.testinsure.controller;

import com.testinsure.entity.LaboratoryTest;
import com.testinsure.service.LaboratoryTestService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/tests")
public class TestController {

    private final LaboratoryTestService testService;

    public TestController(LaboratoryTestService testService) {
        this.testService = testService;
    }

    // 1. Get All Tests (Open to everyone, or at least authenticated users)
    @GetMapping
    public List<LaboratoryTest> getAllTests() {
        return testService.getAllTests();
    }

    // 2. Add Test (RESTRICTED TO ADMIN)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public LaboratoryTest addTest(@RequestBody LaboratoryTest test) {
        return testService.addTest(test);
    }
    
    // 3. Update Test (RESTRICTED TO ADMIN)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public LaboratoryTest updateTest(@PathVariable Long id, @RequestBody LaboratoryTest test) {
        return testService.updateTest(id, test);
    }

    // 4. Delete Test (RESTRICTED TO ADMIN)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public void deleteTest(@PathVariable Long id) {
        testService.deleteTest(id);
    }
}