package com.example.photogram;
import com.example.photogram.entity.User; // 올바른 User 클래스 임포트

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import com.example.photogram.repository.UserRepository;

@SpringBootApplication
public class PhotogramApplication implements WebMvcConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(PhotogramApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(@NonNull CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*");
            }
        };
    }

    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./src/main/resources/static/images/");
    }

    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository) {
        return args -> {
            User user = new User();
            user.setUsername("admin");
            user.setNickname("개쩌는사용자");
            user.setId("awesome101");
            user.setPassword("securePassword123"); // 반드시 유효한 비밀번호 설정
            user.setEmail("awesomeuser@example.com");
            userRepository.save(user);
        };
    }
}
