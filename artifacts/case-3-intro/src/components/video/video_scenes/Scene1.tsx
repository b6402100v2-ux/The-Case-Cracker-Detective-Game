import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 1000), // Lightning flash 1
      setTimeout(() => setPhase(2), 2000), // Title reveal
      setTimeout(() => setPhase(3), 3000), // Lightning flash 2
      setTimeout(() => setPhase(4), 5000), // Exit drift
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-black"
      {...sceneTransitions.fadeBlur}
    >
      {/* Background Video */}
      <motion.video
        src={`${import.meta.env.BASE_URL}videos/manor_exterior.mp4`}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 6, ease: 'easeOut' }}
      />

      {/* Lightning Flashes */}
      <motion.div 
        className="absolute inset-0 bg-white"
        initial={{ opacity: 0 }}
        animate={
          phase === 1 ? { opacity: [0, 0.8, 0, 0.4, 0] } :
          phase === 3 ? { opacity: [0, 0.6, 0] } :
          { opacity: 0 }
        }
        transition={{ duration: 0.5 }}
      />

      {/* Title */}
      <motion.div 
        className="relative z-10 flex flex-col items-center"
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={phase >= 2 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 50, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <h2 className="text-[3vw] text-[#FFD700] font-body font-bold tracking-widest uppercase mb-2">
          CASE #103
        </h2>
        <h1 
          className="text-[12vw] text-white leading-none comic-text-shadow font-display tracking-wider"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          JUDAS MANOR
        </h1>
      </motion.div>
    </motion.div>
  );
}
