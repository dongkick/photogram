package com.example.photogram.service;

import org.springframework.stereotype.Service;

@Service
public class HelloService {

    public String getGreeting() {
        return "Hello from Spring Boot!";
    }
}
