import React, { useState } from 'react';

const Login: React.FC = () => {
  const [view, setView] = useState<'select' | 'signup' | 'login'>('select'); // 화면 상태 관리

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-96">
        {view === 'select' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
            <div className="flex justify-between">
              <button
                onClick={() => setView('signup')}
                className="flex-1 bg-yellow-200 text-center py-4 rounded-md mx-2 hover:bg-yellow-300 transition"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl">👤+</span>
                  <span className="text-lg font-semibold">회원가입</span>
                </div>
              </button>
              <button
                onClick={() => setView('login')}
                className="flex-1 bg-yellow-200 text-center py-4 rounded-md mx-2 hover:bg-yellow-300 transition"
              >
                <div className="flex flex-col items-center">
                  <span className="text-3xl">👤</span>
                  <span className="text-lg font-semibold">로그인</span>
                </div>
              </button>
            </div>
          </>
        )}

        {view === 'signup' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">회원가입</h1>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="id"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="password"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="password check"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition"
              >
                회원가입
              </button>
            </form>
            <button
              onClick={() => setView('select')}
              className="w-full mt-4 text-gray-500 hover:underline"
            >
              뒤로가기
            </button>
          </>
        )}

        {view === 'login' && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">로그인</h1>
            <form>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="id"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  placeholder="password"
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
            <button
              onClick={() => setView('select')}
              className="w-full mt-4 text-gray-500 hover:underline"
            >
              뒤로가기
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
