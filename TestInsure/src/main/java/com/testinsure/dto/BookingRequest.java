package com.testinsure.dto;

import lombok.Data;

@Data
public class BookingRequest {
    private Long testId;
    private Long slotId;
    
    private boolean isInsurance; // true = Pay by Insurance, false = Pay by Cash/Card
    private Long policyId;       // Required only if isInsurance is true

    // --- Manual Getters (To avoid Lombok issues) ---
    public Long getTestId() { return testId; }
    public void setTestId(Long testId) { this.testId = testId; }
    
    public Long getSlotId() { return slotId; }
    public void setSlotId(Long slotId) { this.slotId = slotId; }
    
    public boolean getIsInsurance() { return isInsurance; }
    public void setIsInsurance(boolean isInsurance) { this.isInsurance = isInsurance; }
    
    public Long getPolicyId() { return policyId; }
    public void setPolicyId(Long policyId) { this.policyId = policyId; }
}