import React, { useRef, useEffect } from 'react';

interface HeaderProps {
  selectedRegion: string;
  setSelectedRegion: (value: string | ((prevState: string) => string)) => void;
  onToggleNotifications: () => void; // 알림창 토글 함수 추가
}

const categories = [
  "전체", "경기", "서울", "부산", "경남", "인천", "대구", "충남", "전남", "전북", "대전", "강원", "광주", "충북", "경북", "울산", "세종", "제주"
];

const Header: React.FC<HeaderProps> = ({ selectedRegion, setSelectedRegion, onToggleNotifications }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const selectedButton = containerRef.current.querySelector('.selected');
      if (selectedButton) {
        selectedButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [selectedRegion, containerRef]);

  return (
    <div className="header-content">
      <div className="header-scroll-button-container">
        <div className="header-container" ref={containerRef}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedRegion(category)}
              className={`region-button ${selectedRegion === category ? 'selected' : ''}`}
              aria-pressed={selectedRegion === category}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;