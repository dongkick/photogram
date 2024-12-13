import React, { useRef } from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import
import { Button } from '../components/Button'; // Button 컴포넌트 import
import { PlusCircle, HelpCircle, Heart, MessageCircle, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';

interface Region {
  id: string;
  title: string;
  image: string;
  author: string;
  likes: number;
  comments: number;
}

const recommendations: Region[] = [
  { id: 'nationwide', title: '제주도 올레길', image: 'https://i.ibb.co/DLKQRHr/111.jpg', author: '여행러버', likes: 120, comments: 15 },
  { id: 'seoul', title: '서울 야경 투어', image: 'https://i.ibb.co/0Ycxb6b/222.webp', author: '도시탐험가', likes: 98, comments: 22 },
  { id: 'gyeonggi', title: '부산 해운대 여행', image: 'https://i.ibb.co/JRY9ppW/333.jpg', author: '바다사랑', likes: 85, comments: 10 },
  { id: 'incheon', title: '강원도 산책', image: 'https://i.ibb.co/pRPnfr1/44445.jpg', author: '산림욕매니아', likes: 76, comments: 8 },
  { id: 'busan', title: '경주 역사 여행', image: 'https://i.ibb.co/269n9dD/DSC-9575.jpg', author: '역사탐방가', likes: 92, comments: 18 },
  { id: 'jeju', title: '통영 여행', image: 'https://i.ibb.co/zGJNj2k/6666.jpg', author: '남해여행가', likes: 65, comments: 12 },
];

// 인터페이스 추가
interface RecentTrip {
  id: number;
  title: string;
  location: string;
  date: string;
  image: string;
}

// 최근 여행 더미 데이터 추가
const recentTrips: RecentTrip[] = [
  { id: 1, title: '제주도 돌하르방 투어', image: 'https://i.ibb.co/Gd9V1VC/aaa.webp', location: '제주특별자치시', date: '2024-03-15' },
  { id: 2, title: '부산 온천 탐방', image: 'https://i.ibb.co/Q6S1RgT/bb.jpg', location: '부산 해운대구', date: '2024-03-10' },
  { id: 3, title: '서울 시내 여행', image: 'https://i.ibb.co/6Rh4sjG/cc.webp', location: '서울 용산구', date: '2024-03-05' },
];

const Main: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200; // 한 카드의 너비
      const newScrollPosition = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="space-y-8 px-4 sm:px-6 lg:px-8">
          {/* 시작 가이드 섹션 */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg leading-6 font-medium text-gray-900">시작 가이드</h2>
                <div className="flex space-x-2">
                  <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <PlusCircle className="mr-2 h-5 w-5" />
                    새 여행 기록 작성하기
                  </button>
                  <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    사용 가이드
                  </button>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                <p>여행 기록을 쉽게 작성하고 관리하세요.</p>
                <p>사진을 업로드하면 자동으로 위치가 지도에 표시됩니다.</p>
              </div>
            </div>
          </div>

          {/* 추천 여행 기록 섹션 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">추천 여행 기록</h2>
              <div className="relative group">
                {/* 왼쪽 스크롤 버튼 */}
                <button
                  onClick={() => scroll('left')}
                  className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>

                {/* 오른쪽 스크롤 버튼 */}
                <button
                  onClick={() => scroll('right')}
                  className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-20 bg-white/80 rounded-full p-1.5 shadow-md hover:bg-white transition-all duration-200 opacity-0 group-hover:opacity-100 disabled:opacity-0"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" />
                </button>

                <div 
                  ref={scrollRef}
                  className="flex overflow-x-auto space-x-4 scrollbar-hide relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
                  style={{ scrollSnapType: 'x mandatory' }}
                >
                  {recommendations.map((item) => (
                    <div key={item.id} className="flex-none w-[200px]" style={{ scrollSnapAlign: 'start' }}>
                      <div className="relative h-[300px] w-[200px] rounded-lg overflow-hidden">
                        <img
                          src={process.env.PUBLIC_URL + item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
                          <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                          <p className="text-gray-300 text-xs">{item.author}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Heart size={14} />
                          <span>{item.likes}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle size={14} />
                          <span>{item.comments}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 최근 여행 기록 섹션 */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg leading-6 font-medium text-gray-900">최근 여행 기록</h2>
              <ul className="divide-y divide-gray-200 mt-4">
                {recentTrips.map((trip) => (
                  <li key={trip.id}>
                    <div className="flex items-center py-4">
                      <div className="flex-shrink-0">
                        <img 
                          className="h-16 w-16 rounded-lg object-cover" 
                          src={trip.image} 
                          alt={trip.title} 
                        />
                      </div>
                      <div className="flex-1 px-4">
                        <div className="flex justify-between items-center">
                          <p className="text-sm font-medium text-indigo-600 truncate">{trip.title}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>{trip.date}</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <p className="truncate">{trip.location}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
