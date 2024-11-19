import React, { useRef, useEffect } from 'react';

interface HeaderProps {
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  onToggleNotifications: () => void; // 알림창 토글 함수 추가
}

const Header: React.FC<HeaderProps> = ({ selectedRegion, setSelectedRegion, onToggleNotifications }) => {
  const categories = [
    '전체', '서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', 
    '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
      const currentIndex = categories.indexOf(selectedRegion);
      if (currentIndex > 0) {
        setSelectedRegion(categories[currentIndex - 1]);
      }
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
      const currentIndex = categories.indexOf(selectedRegion);
      if (currentIndex < categories.length - 1) {
        setSelectedRegion(categories[currentIndex + 1]);
      }
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const selectedButton = containerRef.current.querySelector('.selected');
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedRegion]);

  return (
    <div className="header-content">
      <button className="header-scroll-button left" onClick={scrollLeft}>◀</button>
      <div className="header-container" ref={containerRef}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedRegion(category)}
            className={`region-button ${selectedRegion === category ? 'selected' : ''}`}
          >
            {category}
          </button>
        ))}
      </div>
      <button className="header-scroll-button right" onClick={scrollRight}>▶</button>
      <button className="notifications-button" onClick={onToggleNotifications}>🔔</button> {/* 알림 버튼 추가 */}
    </div>
  );
};

export default Header;
