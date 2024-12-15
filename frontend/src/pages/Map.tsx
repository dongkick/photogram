import React, { useState } from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import

const Map: React.FC = () => {
  // selectedRegion 상태와 setSelectedRegion 함수 추가
  const [selectedRegion, setSelectedRegion] = useState<string>('전체');

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header 컴포넌트에 props 전달 */}
      <Header selectedRegion={selectedRegion} setSelectedRegion={setSelectedRegion} />

      {/* About Content */}
      <main className="container mx-auto p-4">
        <h1>지도 페이지</h1>
        <p>여기에 지도 관련 기능이 들어갑니다.</p>
      </main>
    </div>
  );
};

export default Map;
