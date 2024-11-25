import React, { useState } from 'react'; // useState 추가
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // useNavigate 추가

const Signup: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate 사용

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 아이디가 비어 있는지 확인
    if (!username) {
      setError('ID를 입력하세요.');
      return;
    }

    // 비밀번호가 8자 이상인지 확인
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    // 비밀번호 확인
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/auth/signup', {
        username,
        password,
      });
      alert('회원가입 성공!');
      navigate('/login'); // 회원가입 후 로그인 페이지로 이동
    } catch (err: any) {
      // 서버에서 아이디 중복 오류 메시지를 받았을 때
      if (err.response && err.response.data === '이미 존재하는 ID입니다.') {
        setError('이미 존재하는 ID입니다.');
      } else {
        setError(err.response?.data?.message || '회원가입 실패');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* 흰색 박스 */}
      <div className="bg-white p-6 rounded-lg shadow-[0px_30px_50px_rgba(0,0,0,0.2)] w-[350px] h-[480px] flex flex-col items-center relative">
        {/* 뒤로가기 버튼 */}
        <Link
          to="/"
          className="absolute top-4 left-5 text-gray-800 text-2xl hover:text-gray-400"
        >
          &lt;
        </Link>
        <h1 className="text-4xl font-bold text-center mt-12 mb-10">회원가입</h1>
        <form className="w-full flex flex-col items-center" onSubmit={handleSignup}>
          <div className="mb-3 w-[80%]">
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-1.5 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-3 w-[80%]">
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-1.5 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <div className="mb-3 w-[80%]">
            <input
              type="password"
              placeholder="비밀번호 확인"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-1.5 border rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-[80%] bg-amber-100 text-black py-2 rounded-md hover:bg-yellow-600 transition"
          >
            회원가입
          </button>
          {error && <p className="text-red-500 mt-3">{error}</p>} {/* 오류 메시지 출력 */}
        </form>
      </div>
    </div>
  );
};

export default Signup;
