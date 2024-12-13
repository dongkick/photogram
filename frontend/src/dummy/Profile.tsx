// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Post, Comment, User } from '../types/Post';
// import Cropper, { Area } from 'react-easy-crop';
// import getCroppedImg from '../utils/cropImage';

// interface ProfileProps {
//   posts: Post[];
//   comments: { [postId: number]: Comment[] };
//   currentUser: string;
//   users: User[];
// }

// const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// const Profile: React.FC<ProfileProps> = ({ posts, comments, currentUser, users }) => {
//   const navigate = useNavigate();
//   const currentUserProfile = users.find(user => user.nickname === currentUser);

//   const userPosts = posts.filter(post => post.author.nickname === currentUser);
//   const userComments = Object.values(comments).flat().filter(comment => comment.author.nickname === currentUser);
//   const likedPosts = posts.filter(post => post.likedBy.some(user => user.nickname === currentUser));

//   const [profileImage, setProfileImage] = useState<string | null>(null);
//   const [croppedArea, setCroppedArea] = useState<Area | null>(null);
//   const [crop, setCrop] = useState({ x: 0, y: 0 });
//   const [zoom, setZoom] = useState(1);
//   const [imageSrc, setImageSrc] = useState<string | null>(null);

//   useEffect(() => {
//     setProfileImage(currentUserProfile?.profileImage || null);
//   }, [currentUserProfile]);

//   const handleGoBack = () => {
//     navigate('/');
//   };

//   const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > MAX_FILE_SIZE) {
//         alert('이미지 크기는 2MB를 초과할 수 없습니다.');
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setImageSrc(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleCropComplete = (croppedAreaPercentage: Area, croppedAreaPixels: Area) => {
//     setCroppedArea(croppedAreaPixels);
//   };

//   const handleSave = async () => {
//     if (imageSrc && croppedArea) {
//       try {
//         const croppedImage = await getCroppedImg(imageSrc, croppedArea);
//         setProfileImage(croppedImage);
//         if (currentUserProfile) {
//           currentUserProfile.profileImage = croppedImage;
//         }
//         setImageSrc(null);
//       } catch (error) {
//         console.error('Error cropping image:', error);
//       }
//     }
//   };

//   const handleReset = () => {
//     setProfileImage(null);
//     setImageSrc(null);
//   };

//   return (
//     <div className="profile-container">
//       <h1 className="profile-title">{currentUser}님의 프로필</h1>
//       <div className="profile-image-section">
//         <label htmlFor="profile-image-upload" className="profile-image-label">
//           {profileImage ? (
//             <img src={profileImage} alt="Profile" className="profile-image" />
//           ) : (
//             <div className="profile-image-placeholder">프로필 이미지 업로드</div>
//           )}
//         </label>
//         <input
//           type="file"
//           id="profile-image-upload"
//           accept="image/*"
//           onChange={handleProfileImageChange}
//           className="profile-image-input"
//         />
//         {imageSrc && (
//           <div className="crop-container">
//             <Cropper
//               image={imageSrc}
//               crop={crop}
//               zoom={zoom}
//               aspect={1}
//               onCropChange={setCrop}
//               onZoomChange={setZoom}
//               onCropComplete={handleCropComplete}
//             />
//           </div>
//         )}
//         {imageSrc && (
//           <div className="button-group">
//             <button onClick={handleSave} className="form-button">저장</button>
//             <button onClick={handleReset} className="form-button">초기화</button>
//           </div>
//         )}
//       </div>
//       <div className="profile-section">
//         <h2 className="profile-subtitle">작성한 게시글</h2>
//         <ul className="profile-posts">
//           {userPosts.map(post => (
//             <li key={post.id} className="profile-post-item">
//               <strong>{post.title}</strong> - {post.date}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="profile-section">
//         <h2 className="profile-subtitle">작성한 댓글</h2>
//         <ul className="profile-comments">
//           {userComments.map(comment => (
//             <li key={comment.id} className="profile-comment-item">
//               {comment.image && (
//                 <img src={comment.image} alt="Comment" className="comment-image" style={{ width: '100px' }} />
//               )}
//               <strong>{comment.content}</strong> - {comment.date}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <div className="profile-section">
//         <h2 className="profile-subtitle">좋아요 누른 게시글</h2>
//         <ul className="profile-liked-posts">
//           {likedPosts.map(post => (
//             <li key={post.id} className="profile-liked-post-item">
//               <strong>{post.title}</strong> - {post.date}
//             </li>
//           ))}
//         </ul>
//       </div>
//       <button className="back-button" onClick={handleGoBack}>게시판으로 돌아가기</button>
//     </div>
//   );
// };

// export default Profile;
export {};