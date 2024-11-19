import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// 기본 포스트에 사진 추가
const defaultPost = {
  id: 1,
  region: '경기',
  title: '첫 번째 게시글',
  author: '작성자1',
  date: '2024. 11. 17. 오후 03:14:58',
  likes: 0,
  liked: false,
  likedBy: [],
  content: '이것은 첫 번째 게시글입니다.',
  comments: [],
  image: 'https://example.com/image.jpg' // 이미지 추가
};

// If you want to start measuring performance in your app, pass a function
// to log results (for example: console.log)
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
