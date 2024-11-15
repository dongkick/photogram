package com.example.photogram.controller;

import com.example.photogram.service.HelloService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @Autowired
    private HelloService helloService;

    @GetMapping("/api/hello")
    public String sayHello() {
        return helloService.getGreeting();
    }
}
