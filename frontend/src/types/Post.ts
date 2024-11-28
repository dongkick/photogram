export interface User {
  id: string; // number에서 string으로 변경
  email: string;
  nickname: string;
  //profileImage: string | null; // 프로필 이미지 속성 추가
}

export interface Comment {
  id: string; // number에서 string으로 변경
  author: User;
  content: string;
  date: string;
  parentId: string | null; // 부모 댓글 ID 추가
  image?: string; // 이미지 속성을 선택적으로 변경
  postId: number; // 댓글이 속한 게시글 ID 추가
}

export interface Post {
  id: number;
  region: string;
  title: string;
  author: User;
  date: string;
  editedDate?: string; // 수정된 날짜 필드 추가
  likes: number;
  liked: boolean;  // liked 속성 추가
  likedBy: User[]; // 좋아요를 누른 사용자 목록 추가
  content: string;
  images: string[]; // 이미지 속성을 배열로 변경
}