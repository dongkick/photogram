import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* 흰색 박스 크기만 키움, 버튼과 입력창 크기는 그대로 유지 */}
      <div className="bg-white p-6 rounded shadow-[0px_30px_50px_rgba(0,0,0,0.2)] w-[350px] h-[430px] flex flex-col">
        {/* 제목 */}
        <h1 className="text-4xl font-bold text-center mt-12 mb-10">로그인</h1>
        <div className="flex justify-center gap-4 mt-6 mb-4"> {/* justify-center로 중앙 정렬, gap으로 간격 조정 */}
          {/* 회원가입 버튼 */}
          <Link
            to="/signup"
            className="bg-amber-100 text-center h-[170px] w-[110px] rounded-lg hover:bg-amber-200 transition"
          >
            <div className="flex flex-col items-center justify-center h-full py-3">
              <span className="text-4xl mb-7">👤+</span> {/* 이모지와 텍스트 간격 추가 */}
              <span className="text-xl font-semibold">회원가입</span>
            </div>
          </Link>
          {/* 로그인 버튼 */}
          <Link
            to="/login"
            className="bg-amber-100 text-center h-[170px] w-[110px] rounded-lg hover:bg-amber-200 transition"
          >
            <div className="flex flex-col items-center justify-center h-full py-3">
              <span className="text-4xl mb-7">👤</span> {/* 이모지와 텍스트 간격 추가 */}
              <span className="text-xl font-semibold">로그인</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
