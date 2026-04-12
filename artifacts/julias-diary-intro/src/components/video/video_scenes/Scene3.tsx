import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 400),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-[var(--color-secondary)]"
      {...sceneTransitions.splitVertical}
    >
      <div className="absolute inset-0 comic-dots opacity-30" />
      
      {/* Drifting comic bubbles */}
      <motion.div 
        className="absolute w-[40vw] h-[40vw] right-[10vw] top-[5vh] opacity-60"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: [0, -20, 0], opacity: 0.6 }}
        transition={{ y: { duration: 4, repeat: Infinity, ease: 'easeInOut' }, opacity: { duration: 1 } }}
      >
        <img src={`${import.meta.env.BASE_URL}images/comic_elements.png`} className="w-full h-full object-contain" alt="" />
      </motion.div>

      <div className="relative z-10 flex flex-col gap-12 w-full px-12">
        <motion.div 
          className="bg-white p-8 border-4 border-black inline-block self-start transform -rotate-3"
          style={{ boxShadow: '12px 12px 0px rgba(0,0,0,1)' }}
          initial={{ opacity: 0, scale: 0.8, x: -100 }}
          animate={phase >= 1 ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: -100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[5vw] font-display text-black leading-none">
            WHAT REALLY<br/>HAPPENED?
          </h2>
        </motion.div>

        <motion.div 
          className="bg-[var(--color-accent)] p-8 border-4 border-black inline-block self-end transform rotate-2"
          style={{ boxShadow: '-12px 12px 0px rgba(0,0,0,1)' }}
          initial={{ opacity: 0, scale: 0.8, x: 100 }}
          animate={phase >= 2 ? { opacity: 1, scale: 1, x: 0 } : { opacity: 0, scale: 0.8, x: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h2 className="text-[5vw] font-display text-black leading-none">
            WHAT IS SHE<br/>HIDING?
          </h2>
        </motion.div>
      </div>
    </motion.div>
  );
}
