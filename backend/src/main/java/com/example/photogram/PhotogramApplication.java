package com.example.photogram;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;

@SpringBootApplication
public class PhotogramApplication implements WebMvcConfigurer {

    public static void main(String[] args) {
        SpringApplication.run(PhotogramApplication.class, args);
    }

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("http://localhost:3000")
                        .allowedMethods("*");
            }
        };
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/images/**")
                .addResourceLocations("file:./src/main/resources/static/images/");
    }

    @Bean
    public CommandLineRunner dataLoader(UserRepository userRepository) {
        return args -> {
            User user = new User();
            user.setNickname("개쩌는사용자");
            user.setId("awesome101");
            user.setEmail("awesomeuser@example.com");
            userRepository.save(user);
        };
    }
}
