// src/shared/components/ScrollAnimate.tsx
"use client";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollAnimate({ children, className = "" }: ScrollAnimateProps) {
  return <div className={className}>{children}</div>;
}
