import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', {
        username,
        password,
      });
      alert('로그인 성공!');  
      setTimeout(() => {
        navigate('/main');
      }, 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || '로그인 실패');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* 흰색 박스 */}
      <div className="bg-white p-6 rounded-lg shadow-[0px_30px_50px_rgba(0,0,0,0.2)] w-[350px] h-[430px] flex flex-col items-center relative">
        <Link
          to="/"
          className="absolute top-4 left-5 text-gray-800 text-2xl hover:text-gray-400"
        >
          &lt;
        </Link>
        <h1 className="text-4xl font-bold text-center mt-12 mb-20">로그인</h1>
        <form className="w-full flex flex-col items-center" onSubmit={handleLogin}>
          <div className="mb-3 w-[80%]">
            <input
              type="text"
              placeholder="id"
              value={username}
              onChange={(e) => setUsername(e.target.value)}  // username 상태 업데이트
              className="w-full px-4 py-1.5 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-3 w-[80%]">
            <input
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}  // password 상태 업데이트
              className="w-full px-4 py-1.5 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-[80%] bg-amber-100 text-black py-2 rounded-md hover:bg-yellow-600 transition"
          >
            로그인
          </button>
        </form>
        {error && <p className="text-red-500 mt-3">{error}</p>}  {/* 오류 메시지 표시 */}
      </div>
    </div>
  );
};

export default Login;
