package com.example.photogram;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostsService {

    @Autowired
    private PostRepository postRepository;

    // 위도/경도 범위 내의 게시물 조회
    public List<Post> getPostsByLocation(Double swLat, Double swLng, Double neLat, Double neLng) {
        return postRepository.findPostsByLocation(swLat, swLng, neLat, neLng);
    }

    // 게시물 저장 후 즉시 DB에 반영
    public Post savePost(Post newPost) {
        // 새 게시물을 저장
        postRepository.save(newPost);

        // 강제로 DB에 반영 (flush)
        postRepository.flush(); 

        return newPost;
    }
}
