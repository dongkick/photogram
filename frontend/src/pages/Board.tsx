import React from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import

const Board: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header 컴포넌트 사용 */}
      <Header />

      {/* About Content */}
      <main className="container mx-auto p-4">
        <h1>게시판 페이지</h1>
        <p>게시판 내용을 보여줍니다.</p>
      </main>
    </div>
  );
};

export default Board;
