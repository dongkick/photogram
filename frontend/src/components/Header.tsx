import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Menu, User } from 'lucide-react'; 
import { Button } from './Button';
import { Link } from 'react-router-dom';  // Link 추가

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <div>
      {/* 상단 바 */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-4">
        <div className="flex items-center">
          {/* 메뉴 열기 / 닫기 버튼 */}
          {isMenuOpen ? (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
              <ChevronLeft className="h-6 w-6" />
              <span className="sr-only">뒤로가기</span>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(true)}>
              <Menu className="h-6 w-6" />
              <span className="sr-only">메뉴</span>
            </Button>
          )}
        </div>

        {/* 프로필 버튼 */}
        <Button variant="ghost" size="icon" onClick={() => setIsProfileOpen(!isProfileOpen)}>
          <User className="h-6 w-6" />
          <span className="sr-only">프로필</span>
        </Button>
      </header>

      {/* 메뉴창 */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`w-80 bg-white p-6 absolute top-0 left-0 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
        >
          {/* 왼쪽 상단 위치 조정 */}
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)} className="absolute top-4 left-4">
            <ChevronLeft className="h-6 w-6" />
            <span className="sr-only">뒤로가기</span>
          </Button>
          <h2 className="text-xl font-semibold mt-12 text-center">메뉴</h2>
          <hr className="border-t border-gray-300 my-2" />
          <nav className="mt-2 text-center">
            <Link to="/main" className="block py-2 text-lg">메인</Link> {/* 홈 페이지로 이동 */}
            <Link to="/map" className="block py-2 text-lg">지도</Link> {/* 지도 페이지로 이동 */}
            <Link to="/board" className="block py-2 text-lg">게시판</Link> {/* 게시판 페이지로 이동 */}
          </nav>
        </div>
      </div>

      {/* 프로필 창 */}
      <div
        className={`fixed inset-0 bg-gray-800 bg-opacity-50 z-50 transition-opacity duration-300 ${isProfileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div
          className={`w-80 bg-white p-6 absolute top-0 right-0 h-full shadow-lg transform transition-transform duration-300 ease-in-out ${isProfileOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          {/* 오른쪽 상단 위치 조정 */}
          <Button variant="ghost" size="icon" onClick={() => setIsProfileOpen(false)} className="absolute top-4 right-4">
            <ChevronRight className="h-6 w-6" />
            <span className="sr-only">뒤로가기</span>
          </Button>
          <h2 className="text-xl font-semibold mt-12 text-center">프로필</h2>
          <hr className="border-t border-gray-300 my-2" />
          <nav className="mt-2 text-center">
            <Link to="/profile" className="block py-2 text-lg">내 정보</Link> {/* 내 정보 페이지로 이동 */}
            <Link to="/" className="block py-2 text-lg">로그아웃</Link> {/* 로그아웃 페이지로 이동 */}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Header;
