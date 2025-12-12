package com.testinsure.controller;

import com.testinsure.entity.InsuranceClaim;
import com.testinsure.service.InsuranceClaimService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/insurance/claims")
public class InsuranceClaimController {

    private final InsuranceClaimService claimService;

    public InsuranceClaimController(InsuranceClaimService claimService) {
        this.claimService = claimService;
    }

    // 1. View All Claims (Admin Only)
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<InsuranceClaim> getAllClaims() {
        return claimService.getAllClaims();
    }

    // 2. Approve Claim (Admin Only)
    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public InsuranceClaim approveClaim(@PathVariable Long id) {
        return claimService.approveClaim(id);
    }

 // 3. Reject Claim (Updated to accept JSON Body)
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public InsuranceClaim rejectClaim(@PathVariable Long id, @RequestBody java.util.Map<String, String> body) {
        // Extract "reason" from the JSON map. Use a default if missing.
        String reason = body.getOrDefault("reason", "Claim Rejected by Admin");
        
        return claimService.rejectClaim(id, reason);
    }
    }