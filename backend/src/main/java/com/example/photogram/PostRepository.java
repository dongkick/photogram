package com.example.photogram;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import java.util.Optional; // Optional import 추가

public interface PostRepository extends JpaRepository<Post, Integer> {
    @EntityGraph(attributePaths = {"comments"})
    List<Post> findByIsDeletedFalse();

    @EntityGraph(attributePaths = {"comments", "likedBy"})
    Optional<Post> findById(int id);
}