import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header from './components/Header';
import PostList from './components/PostList';
import WritePost from './components/WritePost';
import EditPost from './components/EditPost';
import PostDetail from './components/PostDetail';
import Profile from './components/Profile'; // 프로필 컴포넌트 추가
import Notifications from './components/Notifications'; // 알림 컴포넌트 추가
import { Post, Comment } from './types/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';

interface CommentsDictionary {
  [postId: number]: Comment[];
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogPage = location.pathname === '/blog'; // /blog 경로 확인
  const isPostDetailOrWritePage = location.pathname.startsWith('/post/') || location.pathname.startsWith('/write') || location.pathname.startsWith('/edit');
  const isProfilePage = location.pathname === '/profile';

  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [posts, setPosts] = useState<Post[]>([
    { id: 1, region: '경기', title: '첫 번째 게시글', author: '작성자1', date: '2024. 11. 18. 오후 10:30:47', likes: 0, liked: false, likedBy: [], content: '이것은 첫 번째 게시글입니다.', comments: [] },
    // ... 더 많은 게시글 추가 ...
  ]);
  const [comments, setComments] = useState<CommentsDictionary>({});
  const [currentUser, setCurrentUser] = useState<string>('작성자1'); // 로그인한 사용자의 이름
  const [viewedPosts, setViewedPosts] = useState<Set<number>>(new Set()); // 이미 본 게시글 ID를 저장하는 상태
  const [searchQuery, setSearchQuery] = useState<string>(''); // 검색어 상태 추가
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태 추가
  const [sortOption, setSortOption] = useState<string>('date'); // 정렬 옵션 상태 추가
  const [notifications, setNotifications] = useState<{ message: string; image?: string }[]>([]); // 알림 상태 추가
  const postsPerPage = 20; // 페이지당 게시글 수
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<string>('all'); // 검색 유형 상태 추가
  const [profileOpen, setProfileOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuOpen(false);
    }
    if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
      setProfileOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    if (profileOpen) setProfileOpen(false); // 메뉴가 열릴 때 프로필 창을 닫음
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    if (menuOpen) setMenuOpen(false); // 프로필 창이 열릴 때 메뉴를 닫음
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  const closeProfile = () => {
    setProfileOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // 알림을 주기적으로 확인하는 로직 (예: 서버에서 새로운 알림을 가져오는 API 호출)
      // 여기서는 ���������시로 간단히 새로운 알림을 추가하는 로직을 구현
      const newNotification = { message: `알림 새로고침: ${new Date().toLocaleTimeString()}` };
      setNotifications([newNotification]); // 새로운 알림으로 덮어쓰기
    }, 60000); // 1분마다 알림 확인

    return () => clearInterval(interval);
  }, []);

  const addPost = (newPost: { title: string; author: string; content: string; region: string }) => {
    const newPostWithId: Post = {
      ...newPost,
      id: posts.length + 1,
      date: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      likes: 0,
      liked: false, // liked 속성 추가 (기본값: false)
      likedBy: [], // likedBy 속성 추가 (기본값: 빈 배열)
      comments: [],
    };
    setPosts([newPostWithId, ...posts]);
  };

  const editPost = (id: number, updatedPost: { title: string; content: string; region: string }) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...updatedPost, editedDate: new Date().toLocaleString('ko-KR') } : post));
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const newLikes = post.liked ? post.likes - 1 : post.likes + 1; // liked 상태에 따라 좋아요 수 증가/감소
        const newLikedBy = post.liked ? post.likedBy.filter(user => user !== currentUser) : [...post.likedBy, currentUser]; // likedBy 목록 업데이트
        if (!post.liked && post.author !== currentUser) {
          setNotifications([{ message: `${post.author}님의 게시글에 ${currentUser}님이 좋아요를 눌렀습니다.` }]); // 새로운 알림으로 덮어쓰기
        }
        return { ...post, likes: newLikes, liked: !post.liked, likedBy: newLikedBy }; // liked 상태 반전 및 likedBy 목록 업데이트
      }
      return post;
    }));
  };

  const addComment = (postId: number, newComment: Comment) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), newComment]
    }));
    const post = posts.find(post => post.id === postId);
    if (post && post.author !== currentUser) {
      setNotifications([{ message: `${post.author}님의 게시글에 ${currentUser}님이 댓글을 달았습니다.` }]); // 새로운 알림으로 덮어쓰기
    }
    if (newComment.parentId !== null) {
      const parentComment = comments[postId]?.find(comment => comment.id === newComment.parentId);
      if (parentComment && parentComment.author !== currentUser) {
        setNotifications([{ message: `${parentComment.author}님의 댓글에 ${currentUser}님이 답글을 달았습니다.` }]); // 새로운 알림으로 덮어쓰기
      }
    }
  };

  const editComment = (postId: number, commentId: number, updatedContent: string, updatedDate: string) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId].map(comment =>
        comment.id === commentId ? { ...comment, content: updatedContent, date: `${comment.date.split(' (수정됨')[0]} (수정됨 ${updatedDate})` } : comment
      )
    }));
  };

  const deleteComment = (postId: number, commentId: number) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId]?.filter(comment => comment.id !== commentId) || []
    }));
  };

  const handlePostClick = (id: number) => {
    setViewedPosts(prevViewedPosts => new Set(prevViewedPosts).add(id)); // 게시글을 클릭할 때 viewedPosts에 추가
  };

  const deletePost = (id: number) => {
    setPosts(posts.filter(post => post.id !== id));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOption(e.target.value);
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentUser(e.target.value);
  };

  const handleSearchTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSearchType(e.target.value);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleProfileItemClick = (path: string) => {
    navigate(path);
    setProfileOpen(false);
  };

  const handleToggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const parseKoreanDate = (dateStr: string): Date => {
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

  const filteredPosts = posts.filter(post => {
    if (selectedRegion !== '전체' && post.region !== selectedRegion) {
      return false;
    }
    switch (searchType) {
      case 'title':
        return post.title.includes(searchQuery);
      case 'content':
        return post.content.includes(searchQuery);
      case 'author':
        return post.author.includes(searchQuery);
      case 'all':
      default:
        return post.title.includes(searchQuery) || post.content.includes(searchQuery) || post.author.includes(searchQuery);
    }
  });

  const sortedPosts = filteredPosts.sort((a, b) => {
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

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <button className="notifications-button" onClick={handleToggleNotifications}>🔔</button>
        <button className="profile-button" onClick={toggleProfile}>
          <FontAwesomeIcon icon={faUser} />
        </button>
      </header>
      <div ref={menuRef} className={`menu-drawer ${menuOpen ? 'open' : ''}`} style={{ transform: menuOpen ? 'translateX(0)' : 'translateX(-100%)' }}>
        <div className="drawer-header">
          <h2>메뉴</h2>
          <button className="close-button" onClick={closeMenu}>X</button>
        </div>
        <button className="menu-item" onClick={() => handleMenuItemClick('/blog')}>게시판 페이지</button>
        <button className="menu-item" onClick={() => handleMenuItemClick('/map')}>지도 페이지</button>
      </div>
      <div ref={profileRef} className={`profile-drawer ${profileOpen ? 'open' : ''}`} style={{ transform: profileOpen ? 'translateX(0)' : 'translateX(100%)' }}>
        <div className="drawer-header">
          <h2>프로필</h2>
          <button className="close-button" onClick={closeProfile}>X</button>
        </div>
        <button className="profile-item" onClick={() => handleProfileItemClick('/profile')}>내 페이지</button>
        <button className="profile-item">로그아웃</button>
      </div>
      {isBlogPage && (
        <>
          <div className="header-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div className="header-left" style={{ flexGrow: 1, marginRight: '10px' }}>
              <Header selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} onToggleNotifications={handleToggleNotifications} />
            </div>
          </div>
          <div className="search-sort-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
            <div className="search-input-container" style={{ flexGrow: 2, marginRight: '10px', display: 'flex', alignItems: 'center' }}>
              <select value={searchType} onChange={handleSearchTypeChange} className="search-type-select" style={{ marginRight: '10px' }}>
                <option value="all">전체</option>
                <option value="title">제목</option>
                <option value="content">내용</option>
                <option value="author">글쓴이</option>
              </select>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="검색어를 입력하세요"
                className="search-input"
              />
            </div>
            <div className="sort-select-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto' }}>
              <select value={sortOption} onChange={handleSortChange} className="sort-select">
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
        </>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/blog" />} />
        <Route path="/blog" element={
          <PostList 
            posts={currentPosts} 
            currentUser={currentUser}  // 로그인한 사용자 전달
            onToggleLike={toggleLike} // 좋아요 토글 함수 전달
            onAddComment={addComment} // 댓글 추가 함수 전달
            comments={comments} // 댓글 딕셔너리 전달
            viewedPosts={viewedPosts} // 이미 본 게시글 ID 전달
            onPostClick={handlePostClick} // 게시글 클릭 핸들러 전달
            onDeletePost={deletePost} // 게시물 삭제 핸들러 전달
          />
        }/>
        <Route path="/blog/write" element={<WritePost onAddPost={addPost} currentUser={currentUser} selectedRegion={selectedRegion} />} />
        <Route path="/blog/edit/:id" element={
          <EditPost 
            posts={posts} 
            onEditPost={editPost} 
            currentUser={currentUser} 
          />
        }/>
        <Route path="/blog/post/:id" element={
          <PostDetail 
            posts={posts} 
            currentUser={currentUser} 
            onToggleLike={toggleLike} 
            onAddComment={addComment} // 댓글 추가 함수 전달
            comments={comments} // 댓글 딕셔너리 전달
            onDeletePost={deletePost} // 게시물 삭제 핸들러 전달
            onEditComment={editComment} // 댓글 수정 함수 전달
            onDeleteComment={deleteComment} // 댓글 삭제 함수 전달
          />
        }/>
        <Route path="/profile" element={
          <Profile 
            posts={posts} 
            comments={comments} 
            currentUser={currentUser} 
          />
        }/>
        <Route path="/map" element={<div className="map-page">지도 페이지</div>} />
      </Routes>
      {isBlogPage && (
        <div className="pagination-container" style={{ marginTop: '20px' }}>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      )}
      {showNotifications && (
        <Notifications
          notifications={notifications}
          onClose={handleCloseNotifications}
        />
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  );
};

export default App;