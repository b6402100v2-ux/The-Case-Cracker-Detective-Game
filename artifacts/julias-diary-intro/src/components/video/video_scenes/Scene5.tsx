import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene5() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1500),
      setTimeout(() => setPhase(3), 2500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--color-bg-dark)]"
      {...sceneTransitions.morphExpand}
    >
      <div className="absolute inset-0 comic-dots opacity-20" />
      
      {/* Sunburst background rays */}
      <motion.div 
        className="absolute inset-[-50%] opacity-20"
        style={{
          background: 'conic-gradient(var(--color-primary) 0deg 15deg, transparent 15deg 30deg, var(--color-primary) 30deg 45deg, transparent 45deg 60deg, var(--color-primary) 60deg 75deg, transparent 75deg 90deg, var(--color-primary) 90deg 105deg, transparent 105deg 120deg, var(--color-primary) 120deg 135deg, transparent 135deg 150deg, var(--color-primary) 150deg 165deg, transparent 165deg 180deg, var(--color-primary) 180deg 195deg, transparent 195deg 210deg, var(--color-primary) 210deg 225deg, transparent 225deg 240deg, var(--color-primary) 240deg 255deg, transparent 255deg 270deg, var(--color-primary) 270deg 285deg, transparent 285deg 300deg, var(--color-primary) 300deg 315deg, transparent 315deg 330deg, var(--color-primary) 330deg 345deg, transparent 345deg 360deg)'
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6">
        {/* Detective Badge */}
        <motion.div 
          className="w-[15vw] h-[15vw] mb-4 drop-shadow-2xl"
          initial={{ opacity: 0, y: 100, rotate: -45, scale: 0 }}
          animate={phase >= 1 ? { opacity: 1, y: 0, rotate: 0, scale: 1 } : { opacity: 0, y: 100, rotate: -45, scale: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <img src={`${import.meta.env.BASE_URL}images/detective_badge.png`} className="w-full h-full object-contain" alt="Badge" />
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-[10vw] font-display text-white text-stroke-thick leading-none text-center"
          style={{ textShadow: '8px 8px 0px var(--color-primary)' }}
          initial={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          THE CASE<br/>CRACKERS
        </motion.h1>

        {/* Subtitle Tag */}
        <motion.div
          className="bg-[var(--color-accent)] px-8 py-3 border-4 border-black transform -rotate-2"
          style={{ boxShadow: '6px 6px 0px #000' }}
          initial={{ opacity: 0, y: 50 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[3vw] font-display text-black tracking-widest">
            CASE — JULIA'S DIARY
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
