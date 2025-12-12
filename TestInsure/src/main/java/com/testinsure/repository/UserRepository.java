package com.testinsure.repository;

import com.testinsure.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom query to find a user by their email (for Login)
    Optional<User> findByEmail(String email);
    
    // Check if email exists (for Registration validation)
    boolean existsByEmail(String email);
}