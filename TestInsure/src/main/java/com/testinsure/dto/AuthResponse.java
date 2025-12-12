package com.testinsure.dto;

import lombok.Data;

@Data
public class AuthResponse {
    private String token;
    private String role;
    private String name;

    public AuthResponse(String token, String role, String name) {
        this.token = token;
        this.role = role;
        this.name = name;
    }

    // --- MANUAL GETTERS NEEDED FOR JSON RESPONSE ---
    public String getToken() { return token; }
    public String getRole() { return role; }
    public String getName() { return name; }

	public void setToken(String token) {
		this.token = token;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public void setName(String name) {
		this.name = name;
	}
}