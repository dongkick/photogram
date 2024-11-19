import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post, Comment } from '../types/Post';
import '../App.css'; // CSS 파일 추가
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface PostDetailProps {
  posts: Post[];
  currentUser: string; // 현재 로그인한 사용자
  onToggleLike: (id: number, liked: boolean) => void; // 좋아요 토글 함수
  onAddComment: (postId: number, newComment: Comment) => void; // 댓글 추가 함수
  comments: { [postId: number]: Comment[] }; // 댓글 딕셔너리
  onDeletePost: (id: number) => void; // 게시물 삭제 함수 추가
  onEditComment: (postId: number, commentId: number, updatedContent: string, updatedDate: string, imageUrl: string) => void; // 댓글 수정 함수 추가
  onDeleteComment: (postId: number, commentId: number) => void; // 댓글 삭제 함수 추가
}

const PostDetail: React.FC<PostDetailProps> = ({ posts, currentUser, onToggleLike, onAddComment, comments, onDeletePost, onEditComment, onDeleteComment }) => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터로 id 받기
  const post = posts.find(post => post.id === Number(id)); // URL 파라미터로 받은 id에 해당하는 게시글 찾기
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [newComment, setNewComment] = useState(''); // 새 댓글 상태 추가
  const [replyTo, setReplyTo] = useState<number | null>(null); // 답글 상태 추가
  const [replyToAuthor, setReplyToAuthor] = useState<string | null>(null); // 답글 대상 작성자 상태 추가
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null); // 수정 중인 댓글 ID 상태 추가
  const [editingCommentContent, setEditingCommentContent] = useState<string>(''); // 수정 중인 댓글 내용 상태 추가
  const [editingCommentImage, setEditingCommentImage] = useState<string | undefined>(undefined); // 수정 중인 댓글 이미지 상태 추가
  const [newCommentImage, setNewCommentImage] = useState<string | undefined>(undefined);
  const [showComments, setShowComments] = useState(true); // 댓글 창 표시 여부 상태 추가
  const [showLikedBy, setShowLikedBy] = useState(false); // 좋아요 누른 사람들 목록 표시 여부 상태 추가
  const [img, setImg] = useState<string>(''); // 이미지 URL 상태 추가
  const [edID, setEdID] = useState<number | null>(null); // 수정 중인 댓글 ID 상태 추가

  if (!post) {
    return (
      <div>
        <div>게시글을 찾을 수 없습니다.</div>
        <button className="back-button" onClick={() => navigate('/blog')}>메인 페이지로 이동</button>
      </div>
    );
  }
  
  if (comments[post.id] !== undefined && img !== '') {
    const updatedComments = comments[post.id].map((comment) => {
      if(comment.id === edID) return { ...comment, image: img };
      return comment;
    });
    comments[post.id] = updatedComments;
    setImg(''); // 상태 초기화
    setEdID(null); // 상태 초기화
  }

  const handleAddComment = () => {
    const newCommentData: Comment = {
      id: Date.now(),
      author: currentUser,
      content: newComment,
      date: new Date().toLocaleString(),
      parentId: replyTo,
      image: newCommentImage, // 수정된 부분
    };
    onAddComment(post.id, newCommentData);
    setNewComment('');
    setNewCommentImage(undefined); // 수정된 부분
    setReplyTo(null);
    setReplyToAuthor(null);
  };

  const handleEditCommentClick = (commentId: number, content: string, image: string | undefined) => {
    setEditingCommentId(commentId);
    setEditingCommentContent(content);
    setEditingCommentImage(image);
  };

  const handleSaveCommentClick = (commentId: number) => {
    if (!editingCommentContent.trim()) {
      alert('내용을 입력하세요.');
      return;
    }
    const updatedDate = `${new Date().toLocaleString()} (수정됨)`;
    
    setImg(editingCommentImage || '');
    setEdID(commentId); // 수정 중인 댓글 ID 저장

    // 댓글 수정 함수 호출
    onEditComment(
      post.id,
      commentId,
      editingCommentContent,
      updatedDate,
      editingCommentImage || '' // 이미지 포함, 기본값 설정
    );

    // comments 객체 업데이트
    const updatedComments = comments[post.id].map((comment) => {
      if (comment.id === commentId) {
        return {
          ...comment,
          content: editingCommentContent,
          image: editingCommentImage || '',
          date: updatedDate,
        };
      }
      return comment;
    });
    comments[post.id] = updatedComments;

    // 상태 초기화
    setEditingCommentId(null);
    setEditingCommentContent('');
    setEditingCommentImage(undefined); // 초기화
  };

  const handleDeleteCommentClick = (commentId: number) => {
    onDeleteComment(post.id, commentId);
  };

  const handleReplyClick = (commentId: number, author: string) => {
    setReplyTo(commentId);
    setReplyToAuthor(author);
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setReplyToAuthor(null);
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
      setImage(url); // 상태 업데이트
    } else {
      setImage(undefined); // 파일 선택이 없으면 상태 초기화
    }
  };

  const handleDeleteImage = (setImage: React.Dispatch<React.SetStateAction<string | undefined>>) => {
    setImage(undefined);
  };

  const renderComments = (comments: Comment[], parentId: number | null = null) => {
    return comments
      .filter(comment => comment.parentId === parentId)
      .map(comment => (
        <div key={comment.id} className={`comment-container ${parentId ? 'reply' : ''}`}>
          <div className="comment">
            <div className="comment-header">
              <span className="comment-author">{comment.author}</span>
              <span className="comment-date">{comment.date.split(' (수정됨')[0]}</span>
              {comment.date.includes('(수정됨') && (
                <span className="comment-edited-date"> (수정됨 {comment.date.split('(수정됨 ')[1].replace(')', '')})</span>
              )}
            </div>
            <div className="comment-content">
              {comment.image && (
                <div className="comment-image-container">
                  <img className="comment-image" src={comment.image} alt="Comment" />
                  {comment.date.includes('(수정됨') && (
                    <span className="comment-image-edited"> (수정됨)</span>
                  )}
                </div>
              )}
              {comment.content}
              <div className="comment-actions">
                <button className="comment-action-button edit-comment-button" onClick={() => handleEditCommentClick(comment.id, comment.content, comment.image)}>수정</button>
                <button className="comment-action-button reply-button" onClick={() => handleReplyClick(comment.id, comment.author)}>답글</button>
                {comment.author === currentUser && (
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
              <div className="reply-comment-actions">
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
                {(editingCommentId === comment.id ? editingCommentImage : newCommentImage) && (
                  <button className="delete-image-button" onClick={() => handleDeleteImage(editingCommentId === comment.id ? setEditingCommentImage : setNewCommentImage)}>이미지 삭제</button>
                )}
              </div>
              <div className="button-group">
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
          <button className="back-button" onClick={() => navigate('/blog')}>뒤로가기</button>
          {post.author === currentUser && (
            <>
              <button className="edit-post-button" onClick={() => navigate(`/blog/edit/${post.id}`)}>수정</button>
              <button className="delete-post-button" onClick={() => onDeletePost(post.id)}>삭제</button>
            </>
          )}
        </div>
      </div>
      <div className="post-info">
        <div className="post-author-info">
          <div className="profile-details">
            <p className="post-author">작성자: {post.author} {post.author === currentUser && '(나)'}</p>
            <p className="post-date">
              게시일: {post.date}
              {post.editedDate && (
                <span className="post-edited-date" style={{ fontSize: '0.8em', color: '#888' }}> (수정됨 {post.editedDate})</span>
              )}
            </p>
          </div>
        </div>
        <p className="post-content">{post.content}</p>
        {post.image && <img className="post-image" src={post.image} alt="Post" style={{ marginTop: '10px', maxWidth: '100%' }} />}
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
              <li key={index} className="liked-by-item">{user}</li>
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
                {newCommentImage && (
                  <button className="delete-image-button" onClick={() => handleDeleteImage(setNewCommentImage)}>이미지 삭제</button>
                )}
              </div>
              <div className="button-group">
                <button className="add-comment-button" onClick={handleAddComment}>댓글 추가</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PostDetail;