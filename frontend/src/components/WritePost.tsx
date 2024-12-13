import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types/Post';
import axios from 'axios';

interface WritePostProps {
  onAddPost: (newPost: { title: string; author: User; content: string; region: string; images: string[]; }) => string; // ID를 반환하도록 수정 (authorProfileImage: currentUser.profileImage)
  currentUser: User; // 현재 로그인한 사용자
  selectedRegion: string; // 선택된 지역
}

const WritePost: React.FC<WritePostProps> = ({ onAddPost, currentUser, selectedRegion }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [region, setRegion] = useState(selectedRegion !== '전체' ? selectedRegion : '서울'); // 기본값: 서울 (전체 카테고리인 경우)
  const [images, setImages] = useState<File[]>([]); // 이미지 상태 추가
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const post = { title, author: currentUser, content, region, images: [] }; // 이미지 필드 추가
    const formData = new FormData();
    formData.append('post', new Blob([JSON.stringify(post)], { type: 'application/json' }));
    images.forEach((image, index) => {
      formData.append('images', image); // 'image' -> 'images'로 수정
    });

    try {
      const response = await axios.post('http://localhost:8080/api/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const postId = response.data.id;
      navigate(`/blog/post/${postId}`);
    } catch (error) {
      console.error('Error creating post:', error);
    }
    // 상태 초기화
    setTitle('');
    setContent('');
    setRegion(selectedRegion !== '전체' ? selectedRegion : '서울');
    setImages([]);
  };

  const handleCancel = () => {
    navigate('/blog');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      const maxSize = 10 * 1024 * 1024; // 10MB
      for (let file of newImages) {
        if (file.size > maxSize) {
          alert('파일 크기가 10MB를 초과할 수 없습니다.');
          return;
        }
      }
      setImages(prevImages => [...prevImages, ...newImages]);
    }
  };

  const handleImageDelete = (index: number) => {
    setImages(prevImages => {
      const newImages = prevImages.filter((_, i) => i !== index);
      return newImages;
    });
  };

  return (
    <div className="write-post-container">
      <h1 className="write-post-title">글쓰기 페이지</h1>
      <form className="write-post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">글쓴이:</label>
          <input
            type="text"
            value={currentUser.nickname}
            readOnly
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="form-input"
          />
        </div>
        <div className="form-group">
          <label className="form-label">지역:</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)} className="form-select">
            <option value="전체">전체</option>
            <option value="경기">경기</option>
            <option value="서울">서울</option>
            <option value="부산">부산</option>
            <option value="경남">경남</option>
            <option value="인천">인천</option>
            <option value="대구">대구</option>
            <option value="충남">충남</option>
            <option value="전남">전남</option>
            <option value="전북">전북</option>
            <option value="대전">대전</option>
            <option value="강원">강원</option>
            <option value="광주">광주</option>
            <option value="충북">충북</option>
            <option value="경북">경북</option>
            <option value="울산">울산</option>
            <option value="세종">세종</option>
            <option value="제주">제주</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="form-textarea"
            rows={4}
          />
        </div>
        <div className="form-group">
          <label className="form-label">이미지 업로드:</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="form-input"
          />
          <div className="image-preview-container">
            {images.map((image, index) => (
              <div key={index} className="image-preview">
                <img src={URL.createObjectURL(image)} alt={`Uploaded ${index}`} style={{ marginTop: '10px', maxWidth: '100%' }} />
                <button type="button" onClick={() => handleImageDelete(index)} className="delete-image-button">이미지 삭제</button>
              </div>
            ))}
          </div>
        </div>
        <div className="form-buttons">
          <button type="submit" className="form-button" style={{ backgroundColor: '#FEEFC5', color: 'black' }}>게시글 작성</button>
          <button type="button" onClick={handleCancel} className="form-button cancel-button" style={{ backgroundColor: '#dc3545', color: 'white' }}>취소</button>
        </div>
      </form>
    </div>
  );
};

export default WritePost;