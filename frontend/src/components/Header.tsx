// components/Header.tsx
import React from 'react';
import { Menu, User } from 'lucide-react';
import { Button } from './Button';

const Header: React.FC = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-4">
      <Button variant="ghost" size="icon">
        <Menu className="h-6 w-6" />
        <span className="sr-only">메뉴</span>
      </Button>
      <Button variant="ghost" size="icon">
        <User className="h-6 w-6" />
        <span className="sr-only">프로필</span>
      </Button>
    </header>
  );
};

export default Header;
