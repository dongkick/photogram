import React from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import

const Map: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header 컴포넌트 사용 */}
      <Header />

      {/* About Content */}
      <main className="container mx-auto p-4">
        <h1>지도 페이지</h1>
        <p>여기에 지도 관련 기능이 들어갑니다.</p>
      </main>
    </div>
  );
};

export default Map;