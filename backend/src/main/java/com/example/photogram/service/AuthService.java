package com.example.photogram.service;

import com.example.photogram.entity.User;
import com.example.photogram.dto.UserDto;
import com.example.photogram.exception.UsernameAlreadyExistsException;
import com.example.photogram.exception.UserNotFoundException;
import com.example.photogram.exception.InvalidPasswordException;
import com.example.photogram.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // 생성자 주입으로 UserRepository와 PasswordEncoder 주입
    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 사용자 등록
    public String register(String username, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new UsernameAlreadyExistsException("이미 존재하는 ID입니다.");
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(password));  // 비밀번호 암호화
        userRepository.save(user);

        return "회원가입 성공";
    }

    // 사용자 로그인
    public String login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("없는 ID입니다."));

        // 비밀번호 비교
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidPasswordException("비밀번호를 정확히 입력하세요.");
        }

        return "로그인 성공";
    }
}
