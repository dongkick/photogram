package com.example.photogram.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // PasswordEncoder Bean 등록
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // HttpSecurity 설정을 위한 SecurityFilterChain Bean 등록
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests()
            .requestMatchers("/auth/signup", "/auth/login").permitAll()  // 회원가입 및 로그인 경로는 인증 없이 접근 허용
            .anyRequest().authenticated()  // 그 외의 경로는 인증된 사용자만 접근 가능
            .and()
            .formLogin()  // 기본 로그인 폼을 사용하도록 설정
            .loginPage("/login") // 사용자 정의 로그인 페이지
            .defaultSuccessUrl("/main", true)
            .permitAll(); // 로그인 폼은 모든 사용자에게 허용
        
        return http.build();
    }
}
