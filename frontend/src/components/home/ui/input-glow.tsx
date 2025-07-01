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
                <form className="flex items-center justify-between bg-black/50 border border-white/10 rounded-3xl px-6 py-5 shadow-xl backdrop-blur-md" onSubmit={handleSubmit}>
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
                        disabled={!inputValue.trim() || isSubmitting}
                        aria-label="Submit"
                        className="cursor-pointer bg-gradient-to-r from-purple-600 to-purple-500 h-14 hidden md:flex items-center justify-center text-sm font-normal tracking-wide rounded-full text-white w-fit px-6 shadow-[inset_0_1px_2px_rgba(255,255,255,0.15),0_3px_3px_-1.5px_rgba(128,90,213,0.2),0_1px_1px_rgba(128,90,213,0.3)] border border-purple-500/30"
                    >
                        <ArrowUp className="h-4 w-4 group-hover:translate-y-[-1px] transition-transform" />
                        ASK
                    </button>

                </form>
            </div>
        </div>
    );
}
