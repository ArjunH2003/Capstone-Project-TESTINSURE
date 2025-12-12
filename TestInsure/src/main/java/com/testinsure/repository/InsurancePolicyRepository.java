package com.testinsure.repository;

import com.testinsure.entity.InsurancePolicy;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InsurancePolicyRepository extends JpaRepository<InsurancePolicy, Long> {
    // Find policies belonging to a specific user
    List<InsurancePolicy> findByUser_UserId(Long userId);
}