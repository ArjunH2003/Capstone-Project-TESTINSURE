package com.testinsure.service;

import com.testinsure.entity.LaboratoryTest;
import com.testinsure.repository.LaboratoryTestRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class LaboratoryTestService {

    private final LaboratoryTestRepository testRepository;

    public LaboratoryTestService(LaboratoryTestRepository testRepository) {
        this.testRepository = testRepository;
    }

    // 1. Add a new Test (Admin only)
    public LaboratoryTest addTest(LaboratoryTest test) {
        return testRepository.save(test);
    }

    // 2. Get all Tests (For Patients to browse)
    public List<LaboratoryTest> getAllTests() {
        return testRepository.findAll();
    }

    // 3. Update a Test
    public LaboratoryTest updateTest(Long id, LaboratoryTest updatedTest) {
        LaboratoryTest existing = testRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Test not found"));
        
        existing.setName(updatedTest.getName());
        existing.setDescription(updatedTest.getDescription());
        existing.setCost(updatedTest.getCost());
        existing.setPrepInstructions(updatedTest.getPrepInstructions());
        
        return testRepository.save(existing);
    }
    
    // 4. Delete a Test
    public void deleteTest(Long id) {
        testRepository.deleteById(id);
    }
}