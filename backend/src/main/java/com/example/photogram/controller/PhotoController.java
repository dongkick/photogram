package com.example.photogram.controller;

import com.drew.imaging.ImageMetadataReader;
import com.drew.metadata.Metadata;
import com.drew.metadata.exif.GpsDirectory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class PhotoController {

    @PostMapping("/upload")
    public ResponseEntity<?> uploadPhoto(@RequestParam("photo") MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            // Metadata Extractor 라이브러리를 사용하여 메타데이터 읽기
            Metadata metadata = ImageMetadataReader.readMetadata(inputStream);
            GpsDirectory gpsDirectory = metadata.getFirstDirectoryOfType(GpsDirectory.class);

            if (gpsDirectory != null && gpsDirectory.getGeoLocation() != null) {
                double latitude = gpsDirectory.getGeoLocation().getLatitude();
                double longitude = gpsDirectory.getGeoLocation().getLongitude();

                // 좌표 데이터를 맵에 저장
                Map<String, Double> coords = new HashMap<>();
                coords.put("latitude", latitude);
                coords.put("longitude", longitude);

                return ResponseEntity.ok(coords); // 좌표 응답
            } else {
                // GPS 정보가 없는 경우
                Map<String, String> error = new HashMap<>();
                error.put("message", "GPS 정보를 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(error);
            }
        } catch (Exception e) {
            // 예외 처리
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "서버 에러 발생: " + e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}
