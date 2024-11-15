import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Our Website</h1>
      <nav>
        <Link to="/signup">회원가입</Link> | <Link to="/login">로그인</Link>
      </nav>
    </div>
  );
};

export default Home;
