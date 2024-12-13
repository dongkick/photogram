import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, Comment, User } from '../types/Post';
import axios from 'axios';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface PostDetailProps {
  posts: Post[];
  currentUser: User;
  onToggleLike: (id: number) => void;
  onAddComment: (postId: number, newComment: Comment) => void;
  comments: { [postId: number]: Comment[] };
  onDeletePost: (id: number) => void;
  onEditComment: (postId: number, commentId: string, updatedContent: string, updatedDate: string, imageUrl: string) => void;
  onDeleteComment: (postId: number, commentId: string) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ currentUser, onToggleLike, comments, onDeletePost, onEditComment, onDeleteComment }) => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');
  const [editingCommentImage, setEditingCommentImage] = useState<string | undefined>(undefined);
  const [newCommentImage, setNewCommentImage] = useState<string | undefined>(undefined);
  const [showComments, setShowComments] = useState(true);
  const [showLikedBy, setShowLikedBy] = useState(false);
  const [likedBy, setLikedBy] = useState<User[]>([]);
  const [postComments, setPostComments] = useState<Comment[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}`, {
          params: { userId: currentUser.id },
        });
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id, currentUser.id]);

  useEffect(() => {
    const fetchLikedBy = async () => {
      if (showLikedBy && post) {
        try {
          const response = await axios.get(`http://localhost:8080/api/posts/${post.id}/likedBy`);
          setLikedBy(Array.from(response.data)); // Set을 배열로 변환하여 사용
        } catch (error) {
          console.error('Error fetching liked by users:', error);
        }
      }
    };
    fetchLikedBy();
  }, [showLikedBy, post]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/posts/${id}/comments`);
        setPostComments(response.data);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    fetchComments();
  }, [id]);

  const handleDeleteImage = useCallback(
    (setImage: React.Dispatch<React.SetStateAction<string | undefined>>) => {
      try {
        setImage(undefined);
      } catch (error) {
        alert("이미지를 삭제하는 중 오류가 발생했습니다.");
      }
    },
    []
  );

  const handleToggleLike = async () => {
    if (!post) return;
    try {
      const updatedPost = { 
        ...post, 
        isLiked: !post.isLiked,
        likes: post.isLiked ? post.likes - 1 : post.likes + 1
      };
      setPost(updatedPost);
      await axios.post(`http://localhost:8080/api/posts/${post.id}/like`, null, {
        params: { userId: currentUser.id },
      });
      onToggleLike(post.id);
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  if (!post) {
    return (
      <div>
        <div>게시글을 찾을 수 없습니다.</div>
        <button className="back-button" onClick={() => navigate('/blog')}>메인 페이지로 이동</button>
      </div>
    );
  }

  const handleAddComment = async () => {
    const newCommentData: Comment = {
      id: Date.now().toString(), // id를 string으로 변경
      author: {
        id: currentUser.id,
        email: currentUser.email,
        nickname: currentUser.nickname,
      },
      content: newComment,
      date: new Date().toLocaleString(),
      parentId: replyTo, // parentId를 string으로 변경
      image: newCommentImage,
      postId: post.id,
    };

    try {
      await axios.post(`http://localhost:8080/api/posts/${post.id}/comments`, newCommentData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setPostComments([...postComments, newCommentData]);
      setNewComment('');
      setNewCommentImage(undefined);
      setReplyTo(null);
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleEditCommentClick = (commentId: string, content: string, image: string | undefined) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setEditingCommentImage(image);
    setReplyTo(null);
  };

  const handleSaveCommentClick = (commentId: string) => {
    if (!editingCommentContent.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    const updatedDate = `${new Date().toLocaleString()} (수정됨)`;

    onEditComment(
      post.id,
      commentId,
      editingCommentContent,
      updatedDate,
      editingCommentImage || ''
    );

    setEditingCommentId(null);
    setEditingCommentContent('');
    setEditingCommentImage(undefined);
  };

  const handleDeleteCommentClick = (commentId: string) => {
    onDeleteComment(post.id, commentId);
  };

  const handleReplyClick = (commentId: string, author: string) => {
    setReplyTo(commentId);
    setEditingCommentId(null);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setNewComment('');
    setNewCommentImage(undefined);
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingCommentContent('');
    setEditingCommentImage(undefined);
  };

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const formData = new FormData();
      formData.append('image', e.target.files[0]);

      try {
        const response = await axios.post('http://localhost:8080/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setImage(response.data.imageUrl);
      } catch (error) {
        console.error('Error uploading image:', error);
        setImage(undefined);
      }
    } else {
      setImage(undefined);
    }
  };

  const handleDeletePostClick = async (postId: number) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      try {
        await axios.delete(`http://localhost:8080/api/posts/${postId}`);
        onDeletePost(postId);
        navigate('/blog');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    }
  };

  const renderComments = (comments: Comment[], parentId: string | null = null) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`comment-container ${parentId ? 'reply' : ''}`}>
          <div className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.author.nickname}</span>
              <span className="comment-date">{comment.date.split(' (수정됨')[0]}</span>
              {comment.date.includes('(수정됨') && (
                <span className="comment-edited-date"> (수정됨 {comment.date.split('(수정됨 ')[1].replace(')', '')})</span>
              )}
            </div>
            <div className="comment-content">
              {comment.image && comment.image !== 'DELETED' && comment.image !== 'undefined' && (
                <div className="comment-image-container">
                  <img className="comment-image" src={comment.image} alt="" />
                </div>
              )}
              {comment.content}
              <div className="comment-actions">
                <button className="comment-action-button edit-comment-button" onClick={() => handleEditCommentClick(comment.id, comment.content, comment.image)}>수정</button>
                <button className="comment-action-button reply-button" onClick={() => handleReplyClick(comment.id, comment.author.nickname)}>답글</button>
                {comment.author.nickname === currentUser.nickname && (
                  <button className="comment-action-button delete-comment-button" onClick={() => handleDeleteCommentClick(comment.id)}>삭제</button>
                )}
              </div>
            </div>
          </div>
          {(replyTo === comment.id || editingCommentId === comment.id) && (
            <div className="reply-section">
              <textarea
                className="reply-textarea"
                value={editingCommentId === comment.id ? editingCommentContent : newComment}
                onChange={(e) => editingCommentId === comment.id ? setEditingCommentContent(e.target.value) : setNewComment(e.target.value)}
                placeholder={editingCommentId === comment.id ? "댓글을 수정하세요" : "답글을 입력하세요"}
                required
              />
              <div className="reply-comment-actions button-group">
                <label htmlFor={`reply-comment-image-${comment.id}`} className="reply-comment-image-label">
                  <FontAwesomeIcon icon={faImage} className="reply-comment-icon" />
                </label>
                <input
                  type="file"
                  id={`reply-comment-image-${comment.id}`}
                  className="reply-comment-image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, (image) => {
                    if (editingCommentId === comment.id) {
                      setEditingCommentImage(image);
                    } else {
                      setNewCommentImage(image);
                    }
                  })}
                />
                {(editingCommentId === comment.id ? editingCommentImage : newCommentImage) && (editingCommentId === comment.id ? editingCommentImage !== 'DELETED' : newCommentImage !== 'DELETED') && (
                  <div>
                    <button
                      className="delete-image-button"
                      onClick={() => handleDeleteImage(editingCommentId === comment.id ? setEditingCommentImage : setNewCommentImage)}
                    >
                      기존 이미지 삭제
                    </button>
                  </div>
                )}
                {editingCommentId === comment.id && (
                  <>
                    <button className="save-comment-button" onClick={() => handleSaveCommentClick(comment.id)}>저장</button>
                    <button className="cancel-button" onClick={handleCancelEdit}>취소</button>
                  </>
                )}
                {replyTo === comment.id && (
                  <>
                    <button className="add-reply-button" onClick={handleAddComment}>답글 추가</button>
                    <button className="cancel-button" onClick={handleCancelReply}>취소</button>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="replies">
            {renderComments(comments, comment.id)}
          </div>
        </div>
      ));
  };

  const toggleComments = () => {
    setShowComments(true);
    setShowLikedBy(false);
  };

  const toggleLikedBy = () => {
    setShowLikedBy(true);
    setShowComments(false);
  };

  return (
    <div className="post-detail-container">
      <div className="post-header">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-actions">
          <button className="form-button back-button" onClick={() => navigate('/blog')}>뒤로가기</button>
          {post.author.nickname === currentUser.nickname && (
            <>
              <button className="form-button edit-post-button" onClick={() => navigate(`/blog/edit/${post.id}`)}>수정</button>
              <button className="form-button delete-post-button" onClick={() => handleDeletePostClick(post.id)}>삭제</button>
            </>
          )}
        </div>
      </div>
      <div className="post-info">
        <div className="post-author-info">
          <div className="profile-details">
            {/* {post.author.profileImage && (
              <img src={post.author.profileImage} alt="Author Profile" className="author-profile-image" />
            )} */}
            <div className="author-info">
              <p className="post-author">{post.author.nickname} {post.author.nickname === currentUser.nickname && '(나)'}</p>
              <p className="post-date">
                {post.date}
                {post.editedDate && (
                  <span className="post-edited-date" style={{ fontSize: '0.8em', color: '#888' }}> (수정됨 {post.editedDate})</span>
                )}
              </p>
            </div>
          </div>
        </div>
        <p className="post-content">{post.content}</p>
        {post.images && post.images.length > 0 && (
          <div className="post-images">
            {post.images.map((image, index) => (
              <img key={index} className="post-image" src={`http://localhost:8080${image}`} alt={`Uploaded ${index}`} style={{ marginTop: '10px', maxWidth: '100%' }} />
            ))}
          </div>
        )}
        <div className="post-stats">
          <div className="post-likes" onClick={handleToggleLike}>
            <span
              className="like-icon"
              role="img"
              aria-label="like"
              style={{ color: post.isLiked ? 'red' : 'black' }}
            >
              {post.isLiked ? '❤️' : '🤍'}
            </span> {post.likes}
          </div>
          <span className="liked-by-button" onClick={toggleLikedBy} style={{ marginLeft: '10px' }}>좋아요</span>
          <span className="comments-button" onClick={toggleComments} style={{ marginLeft: '10px' }}>댓글 ({comments[post.id]?.length || 0})</span>
        </div>
      </div>
      {showLikedBy && (
        <div className="liked-by-container">
          <h3 className="liked-by-title">좋아요를 누른 사람들</h3>
          <ul className="liked-by-list">
            {likedBy.map((user, index) => (
              <li key={index} className="liked-by-item">{user.nickname}</li>
            ))}
          </ul>
        </div>
      )}
      {showComments && (
        <div className="comments-section">
          {renderComments(postComments)}
          {replyTo === null && editingCommentId === null && (
            <div className="add-comment">
              <textarea
                className="add-comment-textarea"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요"
                required
              />
              <div className="add-comment-actions">
                <label htmlFor="add-comment-image" className="add-comment-image-label">
                  <FontAwesomeIcon icon={faImage} className="add-comment-icon" />
                </label>
                <input
                  type="file"
                  id="add-comment-image"
                  className="add-comment-image"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setNewCommentImage)}
                />
                <div className="button-group">
                  <button className="add-comment-button" onClick={handleAddComment}>댓글 추가</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;