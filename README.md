# Photogram Database Structure

`photogram_db`는 **Photogram** 애플리케이션의 데이터를 저장하기 위한 MySQL 데이터베이스입니다. 아래는 데이터베이스의 테이블과 구조를 설명합니다.

---

## 데이터베이스 개요
- **Database Name**: `photogram_db`
- **테이블 목록**:
  - `comments`
  - `post_images`
  - `post_likes`
  - `posts`
  - `users`

---

## 테이블 상세 설명

### 1. `users`
사용자 정보를 저장하는 테이블입니다.

| Column Name | Data Type    | Description       |
|-------------|--------------|-------------------|
| `id`        | VARCHAR(255) | 사용자 고유 ID    |
| `email`     | VARCHAR(255) | 사용자 이메일     |
| `nickname`  | VARCHAR(255) | 사용자 닉네임     |

#### 예시 데이터
| id         | email                   | nickname     |
|------------|-------------------------|--------------|
| awesome101 | awesomeuser@example.com | 개쩌는사용자 |

---

### 2. `posts`
게시물 정보를 저장하는 테이블입니다.

| Column Name    | Data Type    | Description              |
|----------------|--------------|--------------------------|
| `id`           | INT          | 게시물 고유 ID           |
| `content`      | TEXT         | 게시물 내용              |
| `date`         | DATETIME     | 생성 날짜 및 시간         |
| `edited_date`  | DATETIME     | 수정 날짜 및 시간         |
| `is_deleted`   | TINYINT(1)   | 삭제 여부 (`0` or `1`)   |
| `is_liked`     | TINYINT(1)   | 좋아요 여부 (`0` or `1`) |
| `likes`        | INT          | 좋아요 수                |
| `region`       | VARCHAR(255) | 게시물 지역              |
| `title`        | VARCHAR(255) | 게시물 제목              |
| `author_id`    | VARCHAR(255) | 작성자 ID                |

#### 예시 데이터
| id | content                 | date                | edited_date          | is_deleted | is_liked | likes | region | title        | author_id  |
|----|-------------------------|---------------------|----------------------|------------|----------|-------|--------|--------------|------------|
| 1  | ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ | 2024-11-29 15:56:40 | 2024-11-29 15:57:54 | 0          | 1        | 1     | 서울   | ㅋㅋㅋㅋㅋㅋㅋ | awesome101 |

---

### 3. `post_images`
게시물의 이미지를 저장하는 테이블입니다.

| Column Name | Data Type    | Description              |
|-------------|--------------|--------------------------|
| `post_id`   | INT          | 게시물 ID                |
| `images`    | VARCHAR(255) | 이미지 파일 경로         |

#### 예시 데이터
| post_id | images                                               |
|---------|------------------------------------------------------|
| 1       | /images/1732863474604_스크린샷 2024-09-19 173400.png |

---

### 4. `comments`
게시물에 달린 댓글 정보를 저장하는 테이블입니다.

| Column Name | Data Type    | Description              |
|-------------|--------------|--------------------------|
| `id`        | VARCHAR(255) | 댓글 고유 ID             |
| `content`   | TEXT         | 댓글 내용                |
| `date`      | DATETIME     | 생성 날짜 및 시간         |
| `image`     | VARCHAR(255) | 댓글에 첨부된 이미지 경로 |
| `parent_id` | VARCHAR(255) | 부모 댓글 ID (대댓글용)  |
| `author_id` | VARCHAR(255) | 작성자 ID                |
| `post_id`   | INT          | 댓글이 달린 게시물 ID     |

#### 예시 데이터
| id            | content              | date                | image | parent_id     | author_id  | post_id |
|---------------|----------------------|---------------------|-------|---------------|------------|---------|
| 1732863630293 | zzzzzzzzz            | 2024-11-29 16:00:30 | NULL  | NULL          | awesome101 | 1       |
| 1732863632174 | zzzzzzzzzzzzzzzzzzzz | 2024-11-29 16:00:32 | NULL  | 1732863630293 | awesome101 | 1       |
| 1732863633860 | zzzzzzzzzzzzzzz      | 2024-11-29 16:00:33 | NULL  | NULL          | awesome101 | 1       |

---

### 5. `post_likes`
게시물의 좋아요 정보를 저장하는 테이블입니다.

| Column Name | Data Type    | Description              |
|-------------|--------------|--------------------------|
| `post_id`   | INT          | 좋아요가 눌린 게시물 ID   |
| `user_id`   | VARCHAR(255) | 좋아요를 누른 사용자 ID   |

#### 예시 데이터
| post_id | user_id    |
|---------|------------|
| 1       | awesome101 |

---

## 주요 기능
- **사용자 관리**: `users` 테이블에서 사용자 정보 관리.
- **게시물 관리**: `posts`, `post_images` 테이블을 통해 게시물 작성 및 조회.
- **댓글 관리**: `comments` 테이블을 통해 댓글 작성 및 대댓글 지원.
- **좋아요 관리**: `post_likes` 테이블로 게시물 좋아요 관리.

---

## 이미지 

![image](https://github.com/user-attachments/assets/80dff70c-8d86-4eb2-873a-ace5cd063258)
![image](https://github.com/user-attachments/assets/2b26b722-acb3-41e3-a298-34388054f365)
![image](https://github.com/user-attachments/assets/065e6a88-4f30-4018-abb5-12fac676cf44)
![image](https://github.com/user-attachments/assets/f832c395-ad21-4fdd-9294-4d83979c5042)
![image](https://github.com/user-attachments/assets/26ee7ca8-efda-4c8b-8df7-f68fee20a8ea)
![image](https://github.com/user-attachments/assets/3f10fea6-fe64-4593-94f7-12e24b2c9a41)
![image](https://github.com/user-attachments/assets/d22051d7-ac52-4775-983c-32bd968609ee)

