import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post as PostType, User } from '../types/Post'; // 수정

interface EditPostProps {
  posts: PostType[];
  onEditPost: (id: number, updatedPost: { title: string; content: string; region: string; images: string[] }) => void; // 수정
  currentUser: string; // 현재 로그인한 사용자의 이름을 받아옴
}

const EditPost: React.FC<EditPostProps> = ({ posts, onEditPost, currentUser }) => {
  const { id } = useParams<{ id: string }>(); // URL 파라미터로 id 받기
  const postId = parseInt(id || '0', 10); // 파라미터로 받은 id는 문자열이라 숫자로 변환
  const post = posts.find((post) => post.id === postId);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState<User | null>(null);
  const [region, setRegion] = useState(post?.region || '경기');
  const [images, setImages] = useState<string[]>(post?.images || []); // 이미지 상태 추가

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setAuthor(post.author);
      setRegion(post.region);
      setImages(post.images || []);
    }
  }, [post]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (post && post.author.nickname === currentUser) { // 본인만 수정할 수 있도록
      onEditPost(postId, { title, content, region, images });
      navigate(`/blog/post/${id}`); // 수정 후 해당 게시글 상세 페이지로 이동
    } else {
      alert(`본인 글만 수정할 수 있습니다. Current User: ${currentUser}, Post Author: ${post ? post.author.nickname : 'undefined'}`);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setImages(newImages);
    } else {
      setImages([]);
    }
  };

  const handleImageDelete = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  return (
    <div className="edit-post-container">
      <h1>게시글 수정</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>글쓴이:</label>
          <input
            type="text"
            value={author?.nickname || ''}
            readOnly
          />
        </div>
        <div className="form-group">
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>지역:</label>
          <select value={region} onChange={(e) => setRegion(e.target.value)}>
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
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={4}
          />
        </div>
        <div className="form-group">
          <label>이미지 업로드:</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
          {images.length > 0 && (
            <div className="image-preview-container">
              {images.map((image, index) => (
                <div key={index} className="image-preview">
                  <img src={image} alt={`Uploaded ${index}`} style={{ marginTop: '10px', maxWidth: '100%' }} />
                  <button type="button" onClick={() => handleImageDelete(index)} className="delete-image-button">이미지 삭제</button>
                </div>
              ))}
            </div>
          )}
        </div>
        <button type="submit" className="form-button submit-button">수정 완료</button>
      </form>
    </div>
  );
};

export default EditPost;
