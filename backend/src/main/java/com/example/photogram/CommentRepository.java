package com.example.photogram;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, String> {
    List<Comment> findByPostId(int postId);
    List<Comment> findByAuthorId(String authorId);
    void deleteByPostId(int postId);
}