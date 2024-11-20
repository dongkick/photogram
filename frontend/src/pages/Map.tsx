import React, { useEffect, useState } from 'react';
import Header from '../components/Header'; // Header 컴포넌트 import

const Map: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [googleMapSrc, setGoogleMapUrl] = useState<string>('');  // 구글 지도 URL 상태

  const apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('사진을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('photo', selectedFile);

    try {
      const response = await fetch('http://localhost:8080/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || 'GPS 정보를 추출할 수 없습니다.');
        setIsLoading(false);
        return;
      }

      const { latitude, longitude } = await response.json();
      setLatitude(latitude);
      setLongitude(longitude);
    } catch (error) {
      console.error('업로드 중 에러 발생:', error);
      alert('업로드 중 에러가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // latitude 또는 longitude 값이 변경될 때마다 구글 맵 URL을 업데이트
  useEffect(() => {
    if (latitude && longitude) {
      setGoogleMapUrl(`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${latitude},${longitude}&zoom=15`);
    }
  }, [latitude, longitude]); // latitude, longitude가 변경될 때마다 실행됨

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
