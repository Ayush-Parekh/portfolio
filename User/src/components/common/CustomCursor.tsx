import React, { useEffect, useState, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Snappy spring config to eliminate perceived input lag
  const springConfig = { damping: 35, stiffness: 600, mass: 0.2 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Disable on touch devices or reduced motion
    if (
      window.matchMedia('(pointer: coarse)').matches ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible((prev) => (prev ? prev : true));
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const hovered = Boolean(
        target.tagName === 'A' ||
          target.tagName === 'BUTTON' ||
          target.closest('a') ||
          target.closest('button') ||
          target.getAttribute('role') === 'button'
      );

      if (hovered !== isHoveredRef.current) {
        isHoveredRef.current = hovered;
        setIsHovered(hovered);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', moveMouse, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', moveMouse);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  if (!isVisible) return null;

  return (
    <>
      {/* Outer Accent Ring - Hardware accelerated, no heavy mix-blend-difference */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-50 rounded-full border border-[#e91010]/80 shadow-[0_0_10px_rgba(233,16,16,0.35)] will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: isHovered ? 38 : 20,
          height: isHovered ? 38 : 20,
          backgroundColor: isHovered ? 'rgba(233, 16, 16, 0.12)' : 'rgba(233, 16, 16, 0.03)',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 400 }}
      />
      {/* Inner Dot */}
      <motion.div
        className="custom-cursor fixed top-0 left-0 pointer-events-none z-50 w-1.5 h-1.5 bg-[#e91010] rounded-full will-change-transform shadow-[0_0_4px_#e91010]"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
      />
    </>
  );
};
