package com.example.photogram.repository;

import com.example.photogram.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> { // ID 타입: String
    Optional<User> findByUsername(String username);
}
