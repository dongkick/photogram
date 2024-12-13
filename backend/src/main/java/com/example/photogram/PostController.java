package com.example.photogram;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.IOException;
import java.nio.file.NoSuchFileException;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import java.util.HashSet;
import java.util.stream.Stream;

@RestController
@RequestMapping("/api")
public class PostController {

    private static final Logger logger = LoggerFactory.getLogger(PostController.class);

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;
    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(1);

    public PostController(PostRepository postRepository, CommentRepository commentRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.userRepository = userRepository;
        scheduler.scheduleAtFixedRate(this::deleteUnusedImages, 0, 1, TimeUnit.SECONDS); // 이미지 삭제 스케줄링 ()
    }
    
    @GetMapping("/posts")
    public List<Post> getPosts() {
        List<Post> posts = postRepository.findByIsDeletedFalse();
        // 각 포스트의 댓글 정보를 초기화합니다.
        posts.forEach(post -> post.getComments().size());
        return posts;
    }

    @GetMapping("/posts/{id}")
    public Post getPostById(@PathVariable int id, @RequestParam String userId) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        // 포스트의 댓글 정보를 초기화합니다.
        post.getComments().size();
        return post;
    }

    @PostMapping("/posts")
    public Post addPost(@RequestPart("post") Post newPost, @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        logger.info("Received new post: {}", newPost);
        newPost.setDate(new java.util.Date().toString());
        if (newPost.getAuthor() != null && newPost.getAuthor().getId() != null) {
            logger.info("Author ID: {}", newPost.getAuthor().getId());
            User author = userRepository.findById(newPost.getAuthor().getId())
                    .orElseThrow(() -> new RuntimeException("Author not found"));
            newPost.setAuthor(author);
        } else {
            throw new RuntimeException("Author not provided");
        }

        if (images != null && !images.isEmpty()) {
            try {
                List<String> imagePaths = images.stream()
                        .map(image -> {
                            try {
                                return saveImage(image);
                            } catch (IOException e) {
                                throw new RuntimeException("Failed to save image", e);
                            }
                        })
                        .collect(Collectors.toList());
                newPost.setImages(imagePaths);
            } catch (RuntimeException e) {
                throw new RuntimeException("Failed to save images", e);
            }
        }

        return postRepository.save(newPost);
    }

    private String saveImage(MultipartFile image) throws IOException {
        String folder = "src/main/resources/static/images/"; // 이미지 저장 경로
        Path directoryPath = Paths.get(folder);
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath); // 디렉토리가 존재하지 않으면 생성
        }
        String filename = System.currentTimeMillis() + "_" + image.getOriginalFilename();
        byte[] bytes = image.getBytes();
        Path path = Paths.get(folder + filename);
        Files.write(path, bytes);
        return "/images/" + filename; // 반환 경로 수정
    }

    @PutMapping("/posts/{id}")
    public Post updatePost(@PathVariable int id, @RequestPart("post") Post updatedPost, @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        return postRepository.findById(id)
                .map(post -> {
                    post.setTitle(updatedPost.getTitle());
                    post.setContent(updatedPost.getContent());
                    post.setRegion(updatedPost.getRegion());
                    if (images != null && !images.isEmpty()) {
                        try {
                            List<String> imagePaths = images.stream()
                                    .map(image -> {
                                        try {
                                            return saveImage(image);
                                        } catch (IOException e) {
                                            throw new RuntimeException("Failed to save image", e);
                                        }
                                    })
                                    .collect(Collectors.toList());
                            post.setImages(imagePaths);
                        } catch (RuntimeException e) {
                            throw new RuntimeException("Failed to save images", e);
                        }
                    } else {
                        post.setImages(updatedPost.getImages());
                    }
                    post.setEditedDate(new java.util.Date().toString());
                    return postRepository.save(post);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @DeleteMapping("/posts/{id}")
    public void deletePost(@PathVariable int id) {
        postRepository.findById(id).ifPresent(post -> {
            post.setDeleted(true);
            postRepository.save(post);
            scheduler.schedule(() -> {
                deletePostImages(post.getImages());
                commentRepository.deleteByPostId(id);
                postRepository.deleteById(id);
            }, 1, TimeUnit.MINUTES);
        });
    }

    private void deletePostImages(List<String> imagePaths) {
        if (imagePaths != null) {
            for (String imagePath : imagePaths) {
                try {
                    Path path = Paths.get("src/main/resources/static" + imagePath);
                    Files.deleteIfExists(path);
                } catch (NoSuchFileException e) {
                    logger.warn("No such file/directory exists: {}", imagePath);
                } catch (IOException e) {
                    logger.error("Error deleting image: {}", imagePath, e);
                }
            }
        }
    }

    private void deleteUnusedImages() {
        try (Stream<Path> paths = Files.walk(Paths.get("src/main/resources/static/images/"))) {
            Set<String> usedImages = new HashSet<>();
            postRepository.findAll().forEach(post -> usedImages.addAll(post.getImages()));
            paths.filter(Files::isRegularFile).forEach(path -> {
                String imagePath = "/images/" + path.getFileName().toString();
                if (!usedImages.contains(imagePath)) {
                    try {
                        Files.delete(path);
                        logger.info("Deleted unused image: {}", imagePath);
                    } catch (IOException e) {
                        logger.error("Error deleting image: {}", imagePath, e);
                    }
                }
            });
        } catch (IOException e) {
            logger.error("Error walking through images directory", e);
        }
    }

    @GetMapping("/posts/{postId}/comments")
    public List<Comment> getCommentsByPostId(@PathVariable int postId) {
        return commentRepository.findByPostId(postId);
    }

    @PostMapping("/posts/{postId}/comments")
    public Comment addComment(@PathVariable int postId, @RequestBody Comment newComment) {
        return postRepository.findById(postId)
                .map(post -> {
                    newComment.setDate(new java.util.Date().toString());
                    newComment.setPost(post);
                    return commentRepository.save(newComment);
                })
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @PutMapping("/posts/{postId}/comments/{commentId}")
    public Comment updateComment(@PathVariable int postId, @PathVariable String commentId, @RequestBody Comment updatedComment) {
        return commentRepository.findById(commentId)
                .map(comment -> {
                    comment.setContent(updatedComment.getContent());
                    comment.setImage(updatedComment.getImage());
                    comment.setDate(new java.util.Date().toString() + " (수정됨)");
                    return commentRepository.save(comment);
                })
                .orElseThrow(() -> new RuntimeException("Comment not found"));
    }

    @DeleteMapping("/posts/{postId}/comments/{commentId}")
    public void deleteComment(@PathVariable int postId, @PathVariable String commentId) {
        commentRepository.deleteById(commentId);
    }

    @PostMapping("/posts/{postId}/like")
    public Post toggleLike(@PathVariable int postId, @RequestParam String userId) {
        return postRepository.findById(postId).map(post -> {
            User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
            if (post.getLikedBy().contains(user)) {
                post.getLikedBy().remove(user);
                post.setLikes(post.getLikes() - 1);
                post.setLiked(false);
            } else {
                post.getLikedBy().add(user);
                post.setLikes(post.getLikes() + 1);
                post.setLiked(true);
            }
            Post updatedPost = postRepository.save(post);
            // Ensure likedBy is loaded
            updatedPost.getLikedBy().size();
            return updatedPost;
        }).orElseThrow(() -> new RuntimeException("Post not found"));
    }

    @GetMapping("/posts/{postId}/likedBy")
    public Set<User> getLikedByUsers(@PathVariable int postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return post.getLikedBy();
    }
}