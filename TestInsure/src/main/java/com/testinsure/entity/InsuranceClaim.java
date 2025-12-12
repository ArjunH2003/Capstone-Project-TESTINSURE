package com.testinsure.entity; 
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "insurance_claims")
@Data
public class InsuranceClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long claimId;

    // We keep this linkage, but ensure the Booking inside doesn't show ITS claim
    @OneToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    // ... (rest of the fields like policy, status, approvedAmount remain the same) ...
    @ManyToOne
    @JoinColumn(name = "policy_id", nullable = false)
    private InsurancePolicy policy;

    @Enumerated(EnumType.STRING)
    private ClaimStatus status;

    private BigDecimal approvedAmount;
    
    @Column(length = 1000)
    private String remarks;

    private LocalDateTime raisedAt;
    private LocalDateTime resolvedAt;

    @PrePersist
    protected void onCreate() {
        this.raisedAt = LocalDateTime.now();
    }
	public Long getClaimId() {
		return claimId;
	}

	public void setClaimId(Long claimId) {
		this.claimId = claimId;
	}

	public Booking getBooking() {
		return booking;
	}

	public void setBooking(Booking booking) {
		this.booking = booking;
	}

	public InsurancePolicy getPolicy() {
		return policy;
	}

	public void setPolicy(InsurancePolicy policy) {
		this.policy = policy;
	}

	public ClaimStatus getStatus() {
		return status;
	}

	public void setStatus(ClaimStatus status) {
		this.status = status;
	}

	public BigDecimal getApprovedAmount() {
		return approvedAmount;
	}

	public void setApprovedAmount(BigDecimal approvedAmount) {
		this.approvedAmount = approvedAmount;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public LocalDateTime getRaisedAt() {
		return raisedAt;
	}

	public void setRaisedAt(LocalDateTime raisedAt) {
		this.raisedAt = raisedAt;
	}

	public LocalDateTime getResolvedAt() {
		return resolvedAt;
	}

	public void setResolvedAt(LocalDateTime resolvedAt) {
		this.resolvedAt = resolvedAt;
	}
}