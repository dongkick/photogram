import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header>
      <nav>
        <Link to="/">홈</Link> | <Link to="/main">메인</Link> | <Link to="/map">지도</Link> | <Link to="/board">게시판</Link> | <Link to="/profile">프로필</Link>
      </nav>
    </header>
  );
};

export default Header;