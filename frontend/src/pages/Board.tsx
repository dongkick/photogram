import React, { useState } from 'react';
import Header from '../components/Header';

const Board: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string>('전체'); // 상태 추가

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header 컴포넌트에 props 전달 */}
      <Header selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />

      {/* About Content */}
      <main className="container mx-auto p-4">
        <h1>게시판 페이지</h1>
        <p>게시판 내용을 보여줍니다.</p>
      </main>
    </div>
  );
};

export default Board;
