package com.example.photogram;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestPropertySource(locations = "classpath:test-application.properties") // test-application.properties 파일을 지정
public class PhotogramApplicationTests {
    @Test
    void contextLoads() {
    }
}
