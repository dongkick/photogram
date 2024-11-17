// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'; // 버튼의 스타일
  size?: 'default' | 'icon'; // 버튼의 크기
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors
          ${variant === 'default' ? 'bg-blue-500 text-white hover:bg-blue-600' : ''}  // default 스타일
          ${variant === 'ghost' ? 'hover:bg-gray-100' : ''}  // ghost 스타일
          ${size === 'default' ? 'h-10 px-4' : ''}  // default 크기
          ${size === 'icon' ? 'h-10 w-10' : ''}  // icon 크기
          ${className}`}  // 추가로 전달된 클래스명
        ref={ref}
        {...props} // button의 나머지 props 전달
      />
    );
  }
);

Button.displayName = 'Button'; // 컴포넌트 이름 설정

export { Button };
