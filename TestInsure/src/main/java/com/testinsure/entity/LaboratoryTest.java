package com.testinsure.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "laboratory_tests")
@Data
public class LaboratoryTest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    private String name;

    @Column(length = 1000) // Allow longer descriptions
    private String description;

    private BigDecimal cost;

    @Column(length = 1000)
    private String prepInstructions;

	public Long getTestId() {
		return testId;
	}

	public void setTestId(Long testId) {
		this.testId = testId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public BigDecimal getCost() {
		return cost;
	}

	public void setCost(BigDecimal cost) {
		this.cost = cost;
	}

	public String getPrepInstructions() {
		return prepInstructions;
	}

	public void setPrepInstructions(String prepInstructions) {
		this.prepInstructions = prepInstructions;
	}
}