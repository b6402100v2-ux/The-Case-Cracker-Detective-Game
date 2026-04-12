import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 4000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-black"
      {...sceneTransitions.clipCircle}
    >
      {/* Background Video */}
      <div className="absolute inset-0 opacity-60">
        <video 
          src={`${import.meta.env.BASE_URL}videos/candlelight.mp4`}
          className="w-full h-full object-cover"
          autoPlay muted loop playsInline
        />
      </div>

      {/* Diary Image */}
      <motion.div 
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.5, y: -100, rotate: -5 }}
        animate={phase >= 1 ? { opacity: 0.8, scale: 1, y: 0, rotate: 0 } : { opacity: 0, scale: 1.5, y: -100, rotate: -5 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/diary_spotlight.png`} 
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
          alt="Diary under spotlight" 
        />
      </motion.div>

      {/* Halftone pop art overlay */}
      <div className="absolute inset-0 comic-dots opacity-40 mix-blend-overlay" />

      {/* Foreground Title */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.h1 
          className="text-[12vw] font-display text-[var(--color-accent)] leading-none text-stroke-thick tracking-wider uppercase text-center"
          initial={{ opacity: 0, scale: 0.5, rotateX: 90 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, rotateX: 0 } : { opacity: 0, scale: 0.5, rotateX: 90 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          style={{ textShadow: '8px 8px 0px rgba(204,0,0,1)' }}
        >
          JULIA'S<br/>DIARY
        </motion.h1>
      </div>

      {/* Comic Action Lines */}
      {phase >= 2 && (
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full border-[16px] border-[var(--color-primary)]" />
        </motion.div>
      )}
    </motion.div>
  );
}
