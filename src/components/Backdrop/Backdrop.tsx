import React from 'react';

interface BackdropProps {
  isOpen: boolean;
  onClick: () => void;
  className?: string;
}

export default function Backdrop({
  isOpen,
  onClick,
  className = '',
}: BackdropProps) {
  return (
    <div
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${className} ${
        isOpen
          ? 'opacity-100 z-10 pointer-events-auto'
          : 'opacity-0 -z-10 pointer-events-none'
      }`}
      onClick={onClick}
    />
  );
}
