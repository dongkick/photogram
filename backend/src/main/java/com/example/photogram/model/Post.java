package com.example.photogram.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ElementCollection;
import java.util.Date;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String region;
    private String title;
    private String author;
    private String date;
    private String content;
    private String image;
    private int likes;
    private boolean liked;
    @ElementCollection
    private List<String> likedBy;
    private Long authorId; // authorId 추가

    // Getters and Setters
    // ...existing code...
}