import React from 'react';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96 relative">
        <Link
          to="/"
          className="absolute top-2 left-2 text-gray-500 text-2xl hover:text-gray-700"
        >
          &lt;
        </Link>
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <form>
          <div className="mb-4">
            <input
              type="text"
              placeholder="아이디"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="비밀번호"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
          >
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
