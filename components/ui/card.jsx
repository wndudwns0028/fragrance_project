"use client";

export function Card({ children }) {
  return (
    <div className="border shadow-md p-4 rounded bg-white">
      {children}
    </div>
  );
}

export function CardContent({ children }) {
  return <div className="p-2">{children}</div>;
}
