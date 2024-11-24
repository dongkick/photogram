import React, { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, Comment, User } from '../types/Post';
import '../App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface PostDetailProps {
  posts: Post[];
  currentUser: string;
  onToggleLike: (id: number, liked: boolean) => void;
  onAddComment: (postId: number, newComment: Comment) => void;
  comments: { [postId: number]: Comment[] };
  onDeletePost: (id: number) => void;
  onEditComment: (postId: number, commentId: number, updatedContent: string, updatedDate: string, imageUrl: string) => void;
  onDeleteComment: (postId: number, commentId: number) => void;
}

const PostDetail: React.FC<PostDetailProps> = ({ posts, currentUser, onToggleLike, onAddComment, comments, onDeletePost, onEditComment, onDeleteComment }) => {
  const { id } = useParams<{ id: string }>();
  const post = posts.find(post => post.id === Number(id));
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState<string>('');
  const [editingCommentImage, setEditingCommentImage] = useState<string | undefined>(undefined);
  const [newCommentImage, setNewCommentImage] = useState<string | undefined>(undefined);
  const [showComments, setShowComments] = useState(true);
  const [showLikedBy, setShowLikedBy] = useState(false);

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

  if (!post) {
    return (
      <div>
        <div>게시글을 찾을 수 없습니다.</div>
        <button className="back-button" onClick={() => navigate('/blog')}>메인 페이지로 이동</button>
      </div>
    );
  }

  const handleAddComment = () => {
    const newCommentData: Comment = {
      id: Date.now(),
      author: { id: 1, email: 'user1@example.com', nickname: currentUser, profileImage: null },
      content: newComment,
      date: new Date().toLocaleString(),
      parentId: replyTo,
      image: newCommentImage,
      postId: post.id,
    };
    onAddComment(post.id, newCommentData);
    setNewComment('');
    setNewCommentImage(undefined);
    setReplyTo(null);
  };

  const handleEditCommentClick = (commentId: number, content: string, image: string | undefined) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setEditingCommentImage(image);
    setReplyTo(null);
  };

  const handleSaveCommentClick = (commentId: number) => {
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

  const handleDeleteCommentClick = (commentId: number) => {
    onDeleteComment(post.id, commentId);
  };

  const handleReplyClick = (commentId: number, author: string) => {
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

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImage: React.Dispatch<React.SetStateAction<string | undefined>>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImage(url);
    } else {
      setImage(undefined);
    }
  };

  const handleDeletePostClick = (postId: number) => {
    if (window.confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      onDeletePost(postId);
      navigate('/blog');
    }
  };

  const renderComments = (comments: Comment[], parentId: number | null = null) => {
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
                {comment.author.nickname === currentUser && (
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
          {post.author.nickname === currentUser && (
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
            {post.author.profileImage && (
              <img src={post.author.profileImage} alt="Author Profile" className="author-profile-image" />
            )}
            <div className="author-info">
              <p className="post-author">{post.author.nickname} {post.author.nickname === currentUser && '(나)'}</p>
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
              <img key={index} className="post-image" src={image} alt={`Uploaded ${index}`} style={{ marginTop: '10px', maxWidth: '100%' }} />
            ))}
          </div>
        )}
        <div className="post-stats">
          <div className="post-likes" onClick={() => onToggleLike(post.id, post.liked)}>
            <span
              className="like-icon"
              role="img"
              aria-label="like"
              style={{ color: post.liked ? 'red' : 'gray' }}
            >
              {post.liked ? '❤️' : '🤍'}
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
            {post.likedBy.map((user, index) => (
              <li key={index} className="liked-by-item">{user.nickname}</li>
            ))}
          </ul>
        </div>
      )}
      {showComments && (
        <div className="comments-section">
          {renderComments(comments[post.id] || [])}
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