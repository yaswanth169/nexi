'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export default function GlowInput({ inputValue, setInputValue, isSubmitting, handleSubmit }) {
  const glowRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>(null);
  const animationFrame = useRef<number>();

  const target = useRef({ x: 0.5, y: 0.5 });
  const current = useRef({ x: 0.5, y: 0.5 });
  const isUserInteracting = useRef(false);

  useEffect(() => {
    const glowEl = glowRef.current;
    if (!glowEl) return;

    const update = () => {
      // Smoothly move toward the target (LERP)
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;

      glowEl.style.setProperty('--x', `${current.current.x * 100}%`);
      glowEl.style.setProperty('--y', `${current.current.y * 100}%`);

      animationFrame.current = requestAnimationFrame(update);
    };

    animationFrame.current = requestAnimationFrame(update);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = glowEl.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      target.current = { x, y };
      isUserInteracting.current = true;

      glowEl.classList.add('paused');

      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        isUserInteracting.current = false;
        glowEl.classList.remove('paused');
        startAutoRotate();
      }, 2000);
    };

    const startAutoRotate = () => {
      let angle = 0;
      const autoRotate = () => {
        if (isUserInteracting.current) return;

        angle += 0.01;
        target.current.x = 0.5 + 0.4 * Math.cos(angle);
        target.current.y = 0.5 + 0.4 * Math.sin(angle);

        requestAnimationFrame(autoRotate);
      };
      autoRotate();
    };

    glowEl.addEventListener('mousemove', handleMouseMove);
    startAutoRotate();

    return () => {
      glowEl.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame.current);
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <div ref={glowRef} className="glow-wrapper relative w-full max-w-3xl px-4 z-10">
      <div className="glow-border relative rounded-3xl p-[2px] transition-all duration-300">
        <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-3xl px-6 py-8 shadow-xl backdrop-blur-2xl">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="What do you want to know?"
            className="flex-1 bg-transparent text-white placeholder-white/50 text-lg md:text-xl outline-none"
            disabled={isSubmitting}
          />
          <button
            type="submit"
            className="ml-4 p-2 bg-white text-black rounded-full hover:scale-105 transition-transform"
            disabled={!inputValue.trim() || isSubmitting}
            aria-label="Submit"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
