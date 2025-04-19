'use client';

import { useEffect, useState } from 'react';

type ToastProps = {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
};

export default function Toast({ message, type = 'success', duration = 3000 }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  const base = "fixed top-5 right-5 px-4 py-4 rounded-md shadow-md text-white z-50 w-1/2 md:w-1/3";
  const types: Record<string, string> = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-blue-600",
    warning: "bg-yellow-400 text-black"
  };

  return (
    <div className={`${base} ${types[type]}`}>
      {message}
    </div>
  );
}