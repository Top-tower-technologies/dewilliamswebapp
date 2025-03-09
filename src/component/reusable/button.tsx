// components/ui/Button.tsx

import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  className?: string;
};

const Button = ({
  children,
  onClick,
  variant = "primary",
  type = "button",
  className = "",
}: ButtonProps) => {
  let baseStyles = "px-4 py-2 rounded transition-colors duration-200";
  let variantStyles =
    variant === "primary"
      ? "bg-[#D3AE00] text-white hover:bg-yellow-700"
      : "border border-gray-400 text-gray-700 hover:bg-gray-100";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
