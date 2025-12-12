package com.testinsure.controller;

import com.testinsure.entity.InsurancePolicy;
import com.testinsure.service.InsurancePolicyService;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/insurance/policies")
public class InsurancePolicyController {

    private final InsurancePolicyService policyService;

    public InsurancePolicyController(InsurancePolicyService policyService) {
        this.policyService = policyService;
    }

    // 1. Add a Policy (User matches Token)
    @PostMapping
    public InsurancePolicy addPolicy(@RequestBody InsurancePolicy policy, Principal principal) {
        return policyService.addPolicy(principal.getName(), policy);
    }

    // 2. View My Policies
    @GetMapping
    public List<InsurancePolicy> getMyPolicies(Principal principal) {
        return policyService.getUserPolicies(principal.getName());
    }
}