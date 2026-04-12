import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Badge
      setTimeout(() => setPhase(2), 1500), // Game Title
      setTimeout(() => setPhase(3), 2500), // Case Title
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-bg-dark)]"
      {...sceneTransitions.zoomThrough}
    >
      <motion.div 
        className="absolute inset-0 bg-[var(--color-secondary)] opacity-30 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Badge */}
      <motion.div
        className="w-[25vw] h-[25vw] mb-8 relative z-10"
        initial={{ y: -100, opacity: 0, rotateY: 180 }}
        animate={phase >= 1 ? { y: 0, opacity: 1, rotateY: 0 } : { y: -100, opacity: 0, rotateY: 180 }}
        transition={{ type: 'spring', stiffness: 150, damping: 15 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/detective_badge.png`} 
          alt="Detective Badge"
          className="w-full h-full object-contain drop-shadow-[0_10px_20px_rgba(255,215,0,0.4)]"
        />
      </motion.div>

      {/* Main Title */}
      <motion.div
        className="text-center z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={phase >= 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-[8vw] text-white font-display comic-text-shadow tracking-wider leading-none mb-4">
          THE CASE CRACKERS
        </h1>
      </motion.div>

      {/* Subtitle */}
      <motion.div
        className="bg-[#CC0000] px-8 py-3 rounded-sm z-10 comic-border transform rotate-1"
        initial={{ opacity: 0, y: 30 }}
        animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <h2 className="text-[3vw] text-white font-body font-black tracking-widest uppercase">
          CASE #103 — JUDAS MANOR
        </h2>
      </motion.div>
    </motion.div>
  );
}
