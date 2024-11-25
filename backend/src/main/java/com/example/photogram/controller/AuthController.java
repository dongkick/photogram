package com.example.photogram.controller;

import com.example.photogram.service.AuthService;
import com.example.photogram.exception.UsernameAlreadyExistsException;
import com.example.photogram.dto.UserDto;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;


@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> register(@Valid @RequestBody UserDto userDto, BindingResult result) {
        // 유효성 검사에서 오류가 있을 경우
        if (result.hasErrors()) {
            // 첫 번째 에러 메시지 반환 (여러 개일 수 있지만 첫 번째 에러만 반환)
            String errorMessage = result.getAllErrors().get(0).getDefaultMessage();
            return ResponseEntity.badRequest().body(errorMessage);
        }

        try {
            // 서비스로 회원가입 처리
            String message = authService.register(userDto.getUsername(), userDto.getPassword());
            return ResponseEntity.ok(message); // 회원가입 성공 메시지 반환
        } catch (UsernameAlreadyExistsException ex) {
            // 이미 존재하는 ID에 대한 처리
            return ResponseEntity.status(400).body("이미 존재하는 ID입니다.");
        }
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody UserDto userDto) {
        String message = authService.login(userDto.getUsername(), userDto.getPassword());
        return ResponseEntity.ok(message);
    }
}
