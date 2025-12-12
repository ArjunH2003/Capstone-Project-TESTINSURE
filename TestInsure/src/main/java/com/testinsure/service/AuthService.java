package com.testinsure.service;

import com.testinsure.dto.AuthResponse;
import com.testinsure.dto.LoginRequest;
import com.testinsure.dto.RegisterRequest;
import com.testinsure.entity.Role;
import com.testinsure.entity.User;
import com.testinsure.repository.UserRepository;
import com.testinsure.security.JwtUtils;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, 
                       AuthenticationManager authenticationManager, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtUtils = jwtUtils;
    }

    public AuthResponse register(RegisterRequest request) {
        // 1. Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // 2. Create the User Entity
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        // Hash the password using BCrypt
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        // Default role is PATIENT
        user.setRole(Role.PATIENT);

        // 3. Save to Database
        userRepository.save(user);

        // 4. Generate Token (Auto-login after registration)
        String token = jwtUtils.generateToken(user.getEmail());
        
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }

    public AuthResponse login(LoginRequest request) {
        // 1. Authenticate (This checks email & password against DB automatically)
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. If we get here, password is correct. Fetch User.
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Generate Token
        String token = jwtUtils.generateToken(user.getEmail());

        return new AuthResponse(token, user.getRole().name(), user.getName());
    }
}