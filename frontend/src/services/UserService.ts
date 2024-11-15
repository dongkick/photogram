// src/services/UserService.ts

import axios from 'axios';

// User 타입 정의
export interface User {
  id: number;
  name: string;
  email: string;
}

// 사용자 목록을 가져오는 함수
export const getUsers = async (): Promise<User[]> => {
  const response = await axios.get('http://localhost:8080/api/users');  // 백엔드 API URL
  return response.data;
};

// 사용자 추가 함수
export const addUser = async (user: User): Promise<User> => {
  const response = await axios.post('http://localhost:8080/api/users', user);  // 백엔드 API URL
  return response.data;
};
