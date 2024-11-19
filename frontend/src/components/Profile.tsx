import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Post, Comment } from '../types/Post';

interface ProfileProps {
  posts: Post[];
  comments: { [postId: number]: Comment[] };
  currentUser: string;
}

const Profile: React.FC<ProfileProps> = ({ posts, comments, currentUser }) => {
  const navigate = useNavigate();
  const userPosts = posts.filter(post => post.author === currentUser);
  const userComments = Object.values(comments).flat().filter(comment => comment.author === currentUser);
  const likedPosts = posts.filter(post => post.likedBy.includes(currentUser));

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div className="profile-container">
      <h1 className="profile-title">{currentUser}님의 프로필</h1>
      <h2 className="profile-subtitle">작성한 게시글</h2>
      <ul className="profile-posts">
        {userPosts.map(post => (
          <li key={post.id} className="profile-post-item">
            <strong>{post.title}</strong> - {post.date}
          </li>
        ))}
      </ul>
      <h2 className="profile-subtitle">작성한 댓글</h2>
      <ul className="profile-comments">
        {userComments.map(comment => (
          <li key={comment.id} className="profile-comment-item">
            <strong>{comment.content}</strong> - {comment.date}
            {comment.image && <img src={comment.image} alt="Comment" className="comment-image" />}
          </li>
        ))}
      </ul>
      <h2 className="profile-subtitle">좋아요 누른 게시글</h2>
      <ul className="profile-liked-posts">
        {likedPosts.map(post => (
          <li key={post.id} className="profile-liked-post-item">
            <strong>{post.title}</strong> - {post.date}
          </li>
        ))}
      </ul>
      <button className="back-button" onClick={handleGoBack}>게시판으로 돌아가기</button>
    </div>
  );
};

export default Profile;