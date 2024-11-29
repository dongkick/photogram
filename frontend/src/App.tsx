import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import Header2 from './components/Header2';
import PostList from './components/PostList';
import WritePost from './components/WritePost';
import EditPost from './components/EditPost';
import PostDetail from './components/PostDetail';
//import Profile from './components/Profile'; // 프로필 컴포넌트 추가
//import Notifications from './components/Notifications'; // 알림 컴포넌트 추가
import { Post, Comment, User } from './types/Post';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faUser } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

interface CommentsDictionary {
  [postId: number]: Comment[];
}

const AppContent: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isBlogPage = location.pathname === '/blog'; // /blog 경로 확인

  const [selectedRegion, setSelectedRegion] = useState<string>('전체');
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<CommentsDictionary>({}); // 댓글 딕셔너리 상태 추가
  const [currentUser, setCurrentUser] = useState<User>({ id: 'awesome101', email: 'user1@example.com', nickname: '개쩌는사용자'}); // 로그인한 사용자의 정보
  const [viewedPosts, setViewedPosts] = useState<Set<number>>(new Set()); // 이미 본 게시글 ID를 저장하는 상태
  const [searchQuery, setSearchQuery] = useState<string>(''); // 검색어 상태 추가
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태 추가
  const [sortOption, setSortOption] = useState<string>('date'); // 정렬 옵션 상태 추가
  //const [notifications, setNotifications] = useState<{ message: string; image?: string }[]>([]); // 알림 상태 추가
  const postsPerPage = 20; // 페이지당 게시글 수
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchType, setSearchType] = useState<string>('all'); // 검색 유형 상태 추가
  const [profileOpen, setProfileOpen] = useState(false);
  //const [showNotifications, setShowNotifications] = useState(false);

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

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     // 알림을 주기적으로 확인하는 로직 (예: 서버에서 새로운 알림을 가져오는 API 호출)
  //     // 여기서는 1분마다 새로운 알림을 확인하는 것으로 가정
  //     const newNotification = { message: `새로운 알림 ${new Date().toLocaleTimeString()}` };
  //     setNotifications([newNotification]); // 새로운 알림으로 덮어쓰기
  //   }, 60000); // 1분마다 알림 확인

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/posts');
        setPosts(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []);

  const addPost = (newPost: { title: string; author: User; content: string; region: string; images: string[];}): string => { //authorProfileImage: string | null 제외
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
      isLiked: false, // isLiked 속성 추가 (기본값: false)
      likedBy: [], // likedBy 속성 추가 (기본값: 빈 배열)
      images: newPost.images, // images 속성 추가
      comments: [], // comments 속성 추가 (기본값: 빈 배열)
    };
    setPosts([newPostWithId, ...posts]);
    return newPostWithId.id.toString(); // 새 게시글의 ID를 문자열로 반환
  };

  const editPost = (id: number, updatedPost: { title: string; content: string; region: string; images: string[] }) => {
    setPosts(posts.map(post => post.id === id ? { ...post, ...updatedPost, editedDate: new Date().toLocaleString('ko-KR') } : post));    
  };

  const toggleLike = (id: number) => {
    setPosts(posts.map(post => {
      if (post.id === id) {
        const newLikes = post.isLiked ? post.likes - 1 : post.likes + 1;
        return { ...post, likes: newLikes, isLiked: !post.isLiked };
      }
      return post;
    }));
  };

  const addComment = (postId: number, newComment: Comment) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: [...(prevComments[postId] || []), newComment]
    }));
    // const post = posts.find(post => post.id === postId);
    // if (post && post.author.id !== currentUser.id) {
    //   setNotifications([{ message: `${post.author.nickname}님의 게시글에 ${currentUser.nickname}님이 댓글을 달았습니다.` }]); // 새로운 알림으로 덮어쓰기
    // }
    // if (newComment.parentId !== null) {
    //   const parentComment = comments[postId]?.find(comment => comment.id === newComment.parentId);
    //   if (parentComment && parentComment.author.id !== currentUser.id) {
    //     setNotifications([{ message: `${parentComment.author.nickname}님의 댓글에 ${currentUser.nickname}님이 답글을 달았습니다.` }]); // 새로운 알림으로 덮어쓰기
    //   }
    // }
  };

  const editComment = (postId: number, commentId: string, updatedContent: string, updatedDate: string, imageUrl: string) => {
    setComments(prevComments => ({
      ...prevComments,
      [postId]: prevComments[postId].map(comment =>
        comment.id === commentId ? { ...comment, content: updatedContent, date: `${comment.date.split(' (수정됨')[0]} (수정됨 ${updatedDate})`, image: imageUrl } : comment
      )
    }));
  };

  const deleteComment = (postId: number, commentId: string) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleMenuItemClick = (path: string) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleProfileItemClick = (path: string) => {
    navigate(path);
    setProfileOpen(false);
  };

  // const handleToggleNotifications = () => {
  //   setShowNotifications(!showNotifications);
  // };

  // const handleCloseNotifications = () => {
  //   setShowNotifications(false);
  // };

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

  const filteredPosts = Array.isArray(posts) ? posts.filter(post => {
    if (selectedRegion !== '전체' && post.region !== selectedRegion) {
      return false;
    }
    switch (searchType) {
      case 'title':
        return post.title.includes(searchQuery);
      case 'content':
        return post.content.includes(searchQuery);
      case 'author':
        return post.author.nickname.includes(searchQuery);
      case 'all':
      default:
        return post.title.includes(searchQuery) || post.content.includes(searchQuery) || post.author.nickname.includes(searchQuery);
    }
  }) : [];

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
  //const profileImage = posts.find(post => post.author.nickname === currentUser.nickname)?.author.profileImage;

  return (
    <div className="app-container">
      <header className="app-header">
        <button className="menu-button" onClick={toggleMenu}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        {/* <button className="notifications-button" onClick={handleToggleNotifications}>🔔</button> */}
        <button className="profile-button" onClick={toggleProfile}>
        {/* style={{ display: profileImage ? 'none' : 'block' }} */}
          <FontAwesomeIcon icon={faUser} style={{ width: '18px', height: '18px', marginBottom: '2px'}} />
        </button>
        {/* {profileImage && (
          <img className="user-profile-image" src={profileImage} alt="Profile" onClick={toggleProfile} />
        )} */}
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
              <Header2 selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />
              {/* onToggleNotifications={handleToggleNotifications} /> */}
            </div>
          </div>
        </>
      )}
      <Routes>
        <Route path="/" element={<Navigate to="/blog" />} />
        <Route path="/blog" element={
          <PostList 
            posts={currentPosts} 
            currentUser={currentUser} // User 타입으로 전달
            onToggleLike={toggleLike} // 좋아요 토글 함수 전달
            onAddComment={addComment} // 댓글 추가 함수 전달
            comments={comments} // 댓글 딕셔너리 전달
            viewedPosts={viewedPosts} // 이미 본 게시글 ID 전달
            onPostClick={handlePostClick} // 게시글 클릭 핸들러 전달
            onDeletePost={deletePost} // 게시물 삭제 핸들러 전달
            sortOption={sortOption} // 추가
            setSortOption={setSortOption} // 추가
            searchQuery={searchQuery} // 추가
            setSearchQuery={setSearchQuery} // 추가
            searchType={searchType} // 추가
            setSearchType={setSearchType} // 추가
          />
        }/>
        <Route path="/blog/write" element={<WritePost onAddPost={addPost} currentUser={currentUser} selectedRegion={selectedRegion} />} />
        <Route path="/blog/edit/:id" element={
          <EditPost 
            posts={posts} 
            onEditPost={editPost} 
            currentUser={currentUser} // User 타입으로 전달
          />
        }/>
        <Route path="/blog/post/:id" element={
          <PostDetail 
            posts={posts} 
            currentUser={currentUser} // User 타입으로 전달
            onToggleLike={toggleLike} 
            onAddComment={addComment} // 댓글 추가 함수 전달
            comments={comments} // 댓글 딕셔너리 전달
            onDeletePost={deletePost} // 게시물 삭제 핸들러 전달
            onEditComment={editComment} // 댓글 수정 함수 전달
            onDeleteComment={deleteComment} // 댓글 삭제 함수 전달
          />
        }/>
        {/* <Route path="/profile" element={
          <Profile 
            posts={posts} 
            comments={comments} 
            currentUser={currentUser} 
            users={posts.map(post => post.author)} // users prop 추가
          />
        }/> */}
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
      {/* {showNotifications && (
        <Notifications
          notifications={notifications}
          onClose={handleCloseNotifications}
        />
      )} */}
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