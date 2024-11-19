import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Post, Comment } from '../types/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faImage } from '@fortawesome/free-solid-svg-icons';
import '../App.css'; // CSS 파일 추가

interface CommentsDictionary {
  [postId: number]: Comment[];
}

interface PostListProps {
  posts: Post[];
  currentUser: string;
  onToggleLike: (id: number, liked: boolean) => void;
  onAddComment: (postId: number, newComment: Comment) => void;
  comments: CommentsDictionary;
  viewedPosts: Set<number>; // 이미 본 게시글 ID를 저장하는 상태
  onPostClick: (id: number) => void; // 게시글 클릭 핸들러
  onDeletePost: (id: number) => void; // 게시물 삭제 핸들러 추가
}

const PostList: React.FC<PostListProps> = ({ posts, currentUser, onToggleLike, comments, viewedPosts, onPostClick, onDeletePost }) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('date'); // 정렬 옵션 상태 추가

  const handlePostClick = (id: number) => {
    onPostClick(id); // 게시글 클릭 핸들러 호출
    navigate(`/blog/post/${id}`);  // 해당 게시글 상세 페이지로 이동
  };

  const parseKoreanDate = (dateStr: string): Date => { // 한국어로 된 날짜 문자열을 Date 객체로 변환 (예: '2024. 11. 17. 오전 03:14:58' -> Sun Nov 17 2024 03:14:58 GMT+0900)
    const dateRegex = /^(\d{4})\. (\d{1,2})\. (\d{1,2})\.\s*(오전|오후)\s*(\d{1,2}):(\d{2}):(\d{2})$/;
    const match = dateStr.match(dateRegex);
    if (!match) throw new Error('Invalid date format');
    const [_, year, month, day, period, hourStr, minuteStr, secondStr] = match;
    let hour = parseInt(hourStr, 10);
    if (period === '오후' && hour < 12) hour += 12;
    if (period === '오전' && hour === 12) hour = 0;
    return new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      hour,
      parseInt(minuteStr, 10),
      parseInt(secondStr, 10)
    );
  };

  const isNewPost = (date: string) => {
    try {
      const postDate = parseKoreanDate(date);
      const now = new Date();
      const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
      const isNew = diffInHours < 24; // 24시간 이내의 게시글은 new 표시
      return isNew;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const sortedPosts = posts.sort((a, b) => {
    if (sortOption === 'date') {
      return parseKoreanDate(b.date).getTime() - parseKoreanDate(a.date).getTime();
    } else if (sortOption === 'oldest') {
      return parseKoreanDate(a.date).getTime() - parseKoreanDate(b.date).getTime();
    } else if (sortOption === 'likes') {
      if (b.likes === a.likes) {
        return parseKoreanDate(b.date).getTime() - parseKoreanDate(a.date).getTime();
      }
      return b.likes - a.likes;
    } else if (sortOption === 'comments') {
      const bComments = comments[b.id]?.length || 0;
      const aComments = comments[a.id]?.length || 0;
      if (bComments === aComments) {
        return parseKoreanDate(b.date).getTime() - parseKoreanDate(a.date).getTime();
      }
      return bComments - aComments;
    }
    return 0;
  });

  return (
    <div>
      <table className="post-list-table" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead className="post-list-thead">
          <tr className="post-list-tr">
            <th className="post-list-title">제목</th>
            <th className="post-list-author">글쓴이</th>
            <th className="post-list-date">게시일</th>
            <th className="post-list-likes">좋아요</th>
            <th className="post-list-comments">댓글 수</th>
          </tr>
        </thead>
        <tbody>
          {sortedPosts.map((post) => (
            <tr key={post.id} className="post-list-tr">
              <td
                className="post-list-title"
                style={{
                  cursor: 'pointer',
                  color: viewedPosts.has(post.id) ? '#888' : '#007bff', // 이미 본 게시글은 회색으로 표시
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-title">
                  [{post.region}] {post.title}
                  {post.image && <FontAwesomeIcon icon={faImage} className="post-image-icon" style={{ marginLeft: '5px', color: '#ffa500' }} />}
                  {isNewPost(post.date) && !viewedPosts.has(post.id) && (
                    <>
                      <FontAwesomeIcon icon={faStar} className="new-post-icon" />
                      <div className="new-text">NEW</div>
                    </>
                  )}
                </div>
              </td>
              <td className="post-list-author">
                <div className="post-author">
                  {post.author} {post.author === currentUser && '(나)'}
                </div>
              </td>
              <td className="post-list-date">
                <div className="post-date">{post.date}</div>
              </td>
              <td className="post-list-likes">
                <div className="post-likes" onClick={() => onToggleLike(post.id, post.liked)}>
                  <span className="like-icon" role="img" aria-label="like"> {post.liked ? '❤️' : '🤍'}
                  </span> {post.likes}
                </div>
              </td>
              <td className="post-list-comments">
                <div className="post-comments-container">
                  {comments[post.id]?.length || 0}개
                  {post.comments.map(comment => (
                    <div key={comment.id}>
                      {comment.image && <img src={comment.image} alt="Comment" />}
                      {comment.content}
                    </div>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostList;