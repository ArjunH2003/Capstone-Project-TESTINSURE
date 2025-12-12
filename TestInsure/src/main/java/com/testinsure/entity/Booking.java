package com.testinsure.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Import this!
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private LaboratoryTest laboratoryTest;

    @ManyToOne
    @JoinColumn(name = "slot_id", nullable = false)
    private TimeSlot timeSlot;

    // --- CRITICAL FIX: STOP THE LOOP HERE ---
    @OneToOne(mappedBy = "booking", cascade = CascadeType.ALL)
    @JsonIgnore  // <--- This MUST be here
    private InsuranceClaim insuranceClaim;

    @Enumerated(EnumType.STRING)
    private BookingStatus status;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

	public Long getBookingId() {
		return bookingId;
	}

	public void setBookingId(Long bookingId) {
		this.bookingId = bookingId;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public LaboratoryTest getLaboratoryTest() {
		return laboratoryTest;
	}

	public void setLaboratoryTest(LaboratoryTest laboratoryTest) {
		this.laboratoryTest = laboratoryTest;
	}

	public TimeSlot getTimeSlot() {
		return timeSlot;
	}

	public void setTimeSlot(TimeSlot timeSlot) {
		this.timeSlot = timeSlot;
	}

	public InsuranceClaim getInsuranceClaim() {
		return insuranceClaim;
	}

	public void setInsuranceClaim(InsuranceClaim insuranceClaim) {
		this.insuranceClaim = insuranceClaim;
	}

	public BookingStatus getStatus() {
		return status;
	}

	public void setStatus(BookingStatus status) {
		this.status = status;
	}

	public PaymentStatus getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(PaymentStatus paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}