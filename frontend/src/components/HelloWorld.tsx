// src/components/HelloWorld.tsx

import React, { useEffect, useState } from 'react';
import { getUsers, addUser, User } from '../services/UserService';  // 상대 경로 수정

const HelloWorld: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // 사용자 목록 가져오기
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('사용자 목록을 가져오는 중 오류가 발생했습니다:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div>
      <h1>사용자 목록</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name} ({user.email})</li>
        ))}
      </ul>
    </div>
  );
};

export default HelloWorld;
