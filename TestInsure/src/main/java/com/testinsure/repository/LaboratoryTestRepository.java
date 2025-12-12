package com.testinsure.repository;

import com.testinsure.entity.LaboratoryTest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LaboratoryTestRepository extends JpaRepository<LaboratoryTest, Long> {
    // We can add search methods here later if needed, e.g., findByName
}