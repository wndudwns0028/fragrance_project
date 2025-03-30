"use client";

export function Input({ type, placeholder, className }) {
  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      className={`border p-2 rounded ${className}`} 
    />
  );
}
