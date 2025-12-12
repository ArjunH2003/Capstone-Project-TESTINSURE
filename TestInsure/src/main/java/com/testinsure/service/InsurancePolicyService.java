package com.testinsure.service;

import com.testinsure.entity.InsurancePolicy;
import com.testinsure.entity.PolicyStatus;
import com.testinsure.entity.User;
import com.testinsure.repository.InsurancePolicyRepository;
import com.testinsure.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class InsurancePolicyService {

    private final InsurancePolicyRepository policyRepository;
    private final UserRepository userRepository;

    public InsurancePolicyService(InsurancePolicyRepository policyRepository, UserRepository userRepository) {
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
    }

    // 1. Add Policy for a specific User
    public InsurancePolicy addPolicy(String userEmail, InsurancePolicy policy) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        policy.setUser(user);
        policy.setStatus(PolicyStatus.ACTIVE); // Default status is ACTIVE
        
        return policyRepository.save(policy);
    }

    // 2. Get all policies for a specific User
    public List<InsurancePolicy> getUserPolicies(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return policyRepository.findByUser_UserId(user.getUserId());
    }
}