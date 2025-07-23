import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-dark-800 border border-dark-700 rounded-lg p-6 ${className}`}>
      {children}
    </div>
  );
};

export default Card;