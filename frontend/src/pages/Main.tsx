// pages/Main.tsx
import React from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import
import { Button } from '../components/Button'; // Button 컴포넌트 import

interface MapRegion {
  id: string;
  name: string;
  image: string;
}

const regions: MapRegion[] = [
  { id: 'nationwide', name: '전국', image: '/placeholder.svg' },
  { id: 'seoul', name: '서울', image: '/placeholder.svg' },
  { id: 'gyeonggi', name: '경기도', image: '/placeholder.svg' },
  { id: 'incheon', name: '인천', image: '/placeholder.svg' },
  { id: 'busan', name: '부산', image: '/placeholder.svg' },
  { id: 'jeju', name: '제주도', image: '/placeholder.svg' },
];

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header 컴포넌트 사용 */}
      <Header />

      {/* Main Content */}
      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {regions.map((region) => (
            <div
              key={region.id}
              className="overflow-hidden rounded-lg border bg-white shadow-md"
            >
              {/* Image Placeholder with aspect ratio */}
              <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                <img
                  src={process.env.PUBLIC_URL + region.image}
                  alt={`${region.name} 지도`}
                  className="object-cover absolute top-0 left-0 w-full h-full"
                />
              </div>
              <div className="p-4 text-center">
                <h2 className="text-lg font-medium">{region.name}</h2>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Main;
