import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Line 1
      setTimeout(() => setPhase(2), 2000), // Line 2
      setTimeout(() => setPhase(3), 3500), // Line 3
      setTimeout(() => setPhase(4), 4500), // Scale up
      setTimeout(() => setPhase(5), 6000), // Exit drift
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--color-primary)]"
      {...sceneTransitions.wipe}
    >
      <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '20px 20px' }} />

      <div className="relative z-10 flex flex-col items-center gap-8 w-full px-12">
        <motion.div
          className="bg-black text-white px-8 py-4 transform -rotate-2 w-full text-center"
          initial={{ x: "-100vw", opacity: 0 }}
          animate={phase >= 1 ? { x: 0, opacity: 1 } : { x: "-100vw", opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <h2 className="text-[6vw] font-display tracking-wide">READ THE CLUES.</h2>
        </motion.div>

        <motion.div
          className="bg-white text-black px-8 py-4 transform rotate-1 w-full text-center"
          initial={{ x: "100vw", opacity: 0 }}
          animate={phase >= 2 ? { x: 0, opacity: 1 } : { x: "100vw", opacity: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <h2 className="text-[6vw] font-display tracking-wide">MAKE YOUR INFERENCE.</h2>
        </motion.div>

        <motion.div
          className="bg-[var(--color-accent)] text-black px-12 py-6 transform -rotate-3 w-full text-center comic-border"
          initial={{ scale: 0, opacity: 0 }}
          animate={
            phase >= 4 ? { scale: 1.1, rotate: 0 } :
            phase >= 3 ? { scale: 1, opacity: 1, rotate: -3 } :
            { scale: 0, opacity: 0 }
          }
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <h1 className="text-[8vw] font-display tracking-wider comic-text-shadow text-white">CRACK THE CASE.</h1>
        </motion.div>
      </div>
    </motion.div>
  );
}
