import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <h1>로그인</h1>
      <form>
        <div>
          <label>아이디:</label>
          <input type="text" />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
};

export default Login;
