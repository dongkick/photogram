package com.example.photogram;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.repository.query.Param;
import java.util.Optional; // Optional import 추가

public interface PostRepository extends JpaRepository<Post, Integer> {
    @EntityGraph(attributePaths = {"comments"})
    List<Post> findByIsDeletedFalse();

    @EntityGraph(attributePaths = {"comments", "likedBy"})
    Optional<Post> findById(int id);
     @Query("SELECT p FROM Post p WHERE p.latitude BETWEEN :swLat AND :neLat AND p.longitude BETWEEN :swLng AND :neLng AND p.isDeleted = false")
    List<Post> findPostsByLocation(
        @Param("swLat") Double swLat, 
        @Param("swLng") Double swLng, 
        @Param("neLat") Double neLat, 
        @Param("neLng") Double neLng
    );
}