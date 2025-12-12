package com.testinsure.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // 1. CONSTANTS
    // In a real project, store this in application.properties. 
    // This key must be at least 256 bits (32 characters) long.
    private static final String SECRET_KEY = "TestInsureSuperSecretKeyForHospitalProject2025";
    private static final long EXPIRATION_TIME = 86400000; // 24 hours in milliseconds

    // 2. GENERATE TOKEN
    // This creates the "Passport" when user logs in
    public String generateToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // 3. EXTRACT EMAIL FROM TOKEN
    // Reads the "Passport" to see who owns it
    public String getEmailFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    // 4. VALIDATE TOKEN
    // Checks if the "Passport" is fake or expired
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (JwtException e) {
            // Token is invalid (expired, malformed, or fake signature)
            return false;
        }
    }

    // Helper method to decode the key
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
}