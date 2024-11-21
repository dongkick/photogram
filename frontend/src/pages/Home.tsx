import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96 h-[400px] flex flex-col justify-between">
        <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
        <div className="flex justify-between">
          <Link
            to="/signup"
            className="flex-1 bg-yellow-200 text-center py-4 rounded-md mx-2 hover:bg-yellow-300 transition"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">👤+</span>
              <span className="text-lg font-semibold">회원가입</span>
            </div>
          </Link>
          <Link
            to="/login"
            className="flex-1 bg-yellow-200 text-center py-4 rounded-md mx-2 hover:bg-yellow-300 transition"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl">👤</span>
              <span className="text-lg font-semibold">로그인</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
