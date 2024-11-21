package com.example.photogram.service;

import com.example.photogram.model.Post;
import com.example.photogram.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(Post post, Long authorId) {
        post.setAuthorId(authorId);
        post.setDate(new SimpleDateFormat("yyyy.MM.dd. a hh:mm:ss").format(new Date())); // Set current date
        return postRepository.save(post); // MySQL 데이터베이스에 저장
    }

    public Post updatePost(Long id, Post post) {
        Post existingPost = postRepository.findById(id).orElseThrow(() -> new RuntimeException("Post not found"));
        existingPost.setTitle(post.getTitle());
        existingPost.setContent(post.getContent());
        existingPost.setRegion(post.getRegion());
        existingPost.setImage(post.getImage());
        existingPost.setEditedDate(new SimpleDateFormat("yyyy.MM.dd. a hh:mm:ss").format(new Date())); // Set edited date
        return postRepository.save(existingPost);
    }

    public void deletePost(Long id) {
        postRepository.deleteById(id);
    }
}