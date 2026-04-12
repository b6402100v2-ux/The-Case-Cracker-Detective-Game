import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Badge
      setTimeout(() => setPhase(2), 1500),  // THE CASE CRACKERS
      setTimeout(() => setPhase(3), 2500),  // Case Closed
      setTimeout(() => setPhase(4), 5000),  // Fade to black prep
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-bg-dark"
      {...sceneTransitions.zoomThrough}
    >
      {/* Background rays */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          background: 'repeating-conic-gradient(from 0deg, transparent 0deg 15deg, var(--color-primary) 15deg 30deg)',
          backgroundSize: '100% 100%'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Pulsing Badge */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={phase >= 1 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="mb-8"
        >
          <motion.img 
            src={`${import.meta.env.BASE_URL}images/detective_badge.png`}
            alt="Badge"
            className="w-[15vw] max-w-[200px] h-auto comic-shadow drop-shadow-2xl"
            animate={{ scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 90 }}
          animate={phase >= 2 ? { opacity: 1, y: 0, rotateX: 0 } : { opacity: 0, y: 50, rotateX: 90 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <h1 className="text-[10vw] font-display text-bg-light tracking-tighter leading-none text-stroke-thick comic-shadow text-center">
            THE CASE <span className="text-accent">CRACKERS</span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, width: 0 }}
          animate={phase >= 3 ? { opacity: 1, width: "auto" } : { opacity: 0, width: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mt-6 bg-primary px-8 py-2 border-4 border-black comic-shadow overflow-hidden whitespace-nowrap"
        >
          <h2 className="text-[3vw] font-display text-bg-light tracking-widest uppercase">
            Case #101 — Closed
          </h2>
        </motion.div>

      </div>

      {/* Final Fade to Black */}
      <motion.div 
        className="absolute inset-0 bg-black z-50 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 4 ? 1 : 0 }}
        transition={{ duration: 1 }}
      />
    </motion.div>
  );
}
