import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import type { Post, Comment, User } from '../types/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import '../App.css';

interface CommentsDictionary {
  [postId: number]: Comment[];
}

interface PostListProps {
  posts: Post[];
  currentUser: User;
  onToggleLike: (id: number) => void;
  onAddComment: (postId: number, newComment: Comment) => void;
  comments: CommentsDictionary;
  viewedPosts: Set<number>;
  onPostClick: (id: number) => void;
  onDeletePost: (id: number) => void;
  sortOption: string;
  setSortOption: (option: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: string;
  setSearchType: (type: string) => void;
}

const parseKoreanDate = (dateStr: string): Date => {
  const match = dateStr.match(/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) (\w{3}) (\d{1,2}) (\d{2}):(\d{2}):(\d{2}) KST (\d{4})$/);
  if (match) {
    const [ , , monthStr, day, hour, minute, second, year ] = match;
    const monthMap: { [key: string]: number } = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };
    const month = monthMap[monthStr];
    return new Date(Number(year), month, Number(day), Number(hour), Number(minute), Number(second));
  }

  console.error('Invalid date format:', dateStr);
  return new Date(0); // 기본값 반환
};

const truncateTitleByWidth = (title: string, maxWidth: number, font: string) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (context) {
    context.font = font;
    let width = context.measureText(title).width;
    if (width <= maxWidth) return title;
    let truncatedTitle = '';
    for (let i = 0; i < title.length; i++) {
      truncatedTitle += title[i];
      width = context.measureText(truncatedTitle + '...').width;
      if (width > maxWidth) {
        return truncatedTitle.slice(0, -1) + '...';
      }
    }
  }
  return title;
};

const PostList: React.FC<PostListProps> = ({ currentUser, onToggleLike, onAddComment, comments, viewedPosts, onPostClick, onDeletePost, sortOption, setSortOption, searchQuery, setSearchQuery, searchType, setSearchType }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts');
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const handlePostClick = (id: number) => {
    onPostClick(id);
    navigate(`/blog/post/${id}`);
  };

  const isNewPost = useMemo(() => (date: string) => {
    try {
      const postDate = parseKoreanDate(date);
      const now = new Date();
      const diffInHours = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
      return diffInHours < 24;
    } catch (error) {
      console.error(error);
      return false;
    }
  }, []);

  const sortedPosts = useMemo(() => {
    return posts.sort((a, b) => {
      if (sortOption === 'date') {
        return parseKoreanDate(b.date).getTime() - parseKoreanDate(a.date).getTime();
      }
      if (sortOption === 'oldest') {
        return parseKoreanDate(a.date).getTime() - parseKoreanDate(b.date).getTime();
      }
      if (sortOption === 'likes') {
        return b.likes - a.likes;
      }
      if (sortOption === 'comments') {
        const bComments = comments[b.id]?.length || 0;
        const aComments = comments[a.id]?.length || 0;
        return bComments - aComments;
      }
      return 0;
    });
  }, [posts, sortOption, comments]);

  return (
    <div>
      <div className="search-sort-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
        <div className="search-input-container" style={{ flexGrow: 2, marginRight: '10px', display: 'flex', alignItems: 'center' }}>
          <select value={searchType} onChange={(e) => setSearchType(e.target.value)} className="search-type-select" style={{ marginRight: '10px' }}>
            <option value="all">전체</option>
            <option value="title">제목</option>
            <option value="content">내용</option>
            <option value="author">글쓴이</option>
          </select>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            className="search-input"
          />
        </div>
        <div className="sort-select-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="sort-select">
            <option value="date">최신순</option>
            <option value="oldest">오래된 순</option>
            <option value="likes">좋아요순</option>
            <option value="comments">댓글순</option>
          </select>
          <Link to="/blog/write">
            <button className="write-button" style={{ marginTop: '5px' }}>글쓰기</button>
          </Link>
        </div>
      </div>
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
                  color: viewedPosts.has(post.id) ? '#888' : '#007bff',
                }}
                onClick={() => handlePostClick(post.id)}
              >
                <div className="post-title">
                  [{post.region}]{truncateTitleByWidth(post.title, 300, '16px Arial')}
                  {post.images && post.images.length > 0 && post.images[0] !== 'DELETED' && (
                    <FontAwesomeIcon icon={faImage} className="post-image-icon" style={{ marginLeft: '5px', color: '#ffa500' }} />
                  )}
                  {isNewPost(post.date) && !viewedPosts.has(post.id) && <div className="new-text">NEW</div>}
                </div>
              </td>
              <td className="post-list-author">
                <div className="post-author">
                  {post.author.nickname}{post.author.nickname === currentUser.nickname && '(나)'}
                </div>
              </td>
              <td className="post-list-date">
                <div className="post-date">{post.date}</div>
              </td>
              <td className="post-list-likes">
                <div className="post-likes" onClick={() => onToggleLike(post.id)}>
                  <span className="like-icon" role="img" aria-label="like">
                    {post.liked ? '❤️' : '🤍'}
                  </span>
                  {post.likes}
                </div>
              </td>
              <td className="post-list-comments">
                <div className="post-comments-container">
                  {comments[post.id]?.length || 0}개
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