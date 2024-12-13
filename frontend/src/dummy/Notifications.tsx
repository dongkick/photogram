// import React, { useState } from 'react';
// import '../App.css'; // CSS 파일 추가

// interface NotificationsProps {
//   notifications: { message: string; image?: string }[];
//   onClose: () => void; // 알림창 닫기 함수 추가
// }

// const Notifications: React.FC<NotificationsProps> = ({ notifications, onClose }) => {
//   const [position, setPosition] = useState({ x: 0, y: 0 });
//   const [isDragging, setIsDragging] = useState(false);
//   const [offset, setOffset] = useState({ x: 0, y: 0 });

//   const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
//     setIsDragging(true);
//     setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (isDragging) {
//       const newX = e.clientX - offset.x;
//       const newY = e.clientY - offset.y;
//       setPosition({ x: newX, y: newY });
//     }
//   };

//   const handleMouseUp = () => {
//     setIsDragging(false);
//   };

//   React.useEffect(() => {
//     if (isDragging) {
//       document.addEventListener('mousemove', handleMouseMove as any);
//       document.addEventListener('mouseup', handleMouseUp);
//     } else {
//       document.removeEventListener('mousemove', handleMouseMove as any);
//       document.removeEventListener('mouseup', handleMouseUp);
//     }
//     return () => {
//       document.removeEventListener('mousemove', handleMouseMove as any);
//       document.removeEventListener('mouseup', handleMouseUp);
//     };
//   }, [isDragging]);

//   return (
//     <div
//       className="notifications-container"
//       onMouseDown={handleMouseDown}
//       style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
//     >
//       <div className="notifications-header">
//         <h4>알림</h4>
//         <button className="close-button" onClick={onClose}>✖</button>
//       </div>
//       <ul>
//         {notifications.map((notification, index) => (
//           <li key={index}>
//             {notification.message}
//             {notification.image && <img src={notification.image} alt="Notification" className="notification-image" />}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Notifications;
export {};