import React from "react";

interface CardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  onClick?: () => void;
}

const Card = ({ children, title, className = "", onClick }: CardProps) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      } ${className}`}
    >
      {title && (
        <div className="px-6 py-4 border-b border-gray-100 bg-light/30">
          <h3 className="font-bold text-dark">{title}</h3>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
