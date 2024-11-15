import React from 'react';

const Signup: React.FC = () => {
  return (
    <div>
      <h1>회원가입</h1>
      <form>
        <div>
          <label>아이디:</label>
          <input type="text" />
        </div>
        <div>
          <label>비밀번호:</label>
          <input type="password" />
        </div>
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
};

export default Signup;