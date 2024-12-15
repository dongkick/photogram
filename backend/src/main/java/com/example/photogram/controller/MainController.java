package com.example.photogram.controller;  // 'controller' 패키지에 위치

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class MainController {

    @GetMapping("/main")
    public String mainPage() {
        return "main";  // 'main.html' 템플릿을 반환
    }
}
