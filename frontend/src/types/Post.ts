export interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  parentId: number | null;
  image?: string; // 이미지 속성을 선택적으로 변경
}

export interface Post {
  id: number;
  region: string;
  title: string;
  author: string;
  date: string;
  editedDate?: string; // 수정된 날짜 필드 추가
  likes: number;
  liked: boolean;  // liked 속성 추가
  likedBy: string[]; // 좋아요를 누른 사용자 목록 추가
  content: string;
  comments: Comment[];
  image?: string; // 이미지 속성 추가
}