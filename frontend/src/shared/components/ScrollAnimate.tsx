// src/shared/components/ScrollAnimate.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

interface ScrollAnimateProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollAnimate({ children, className = "", delay = 0 }: ScrollAnimateProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-12% 0px -12% 0px" });
  const [scrollDirection, setScrollDirection] = useState<"down" | "up">("down");
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current + 5) {
        setScrollDirection("down");
      } else if (currentScrollY < lastScrollY.current - 5) {
        setScrollDirection("up");
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const variants = {
    hiddenDown: { x: 90, opacity: 0 },
    hiddenUp: { x: -90, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
        delay,
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial={scrollDirection === "down" ? "hiddenDown" : "hiddenUp"}
      animate={isInView ? "visible" : scrollDirection === "down" ? "hiddenDown" : "hiddenUp"}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  );
}
