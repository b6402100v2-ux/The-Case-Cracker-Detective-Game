import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Image slides in
      setTimeout(() => setPhase(2), 1500), // Text box pops up
      setTimeout(() => setPhase(3), 2500), // Text appears
      setTimeout(() => setPhase(4), 5000), // Exit drift
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-dark)]"
      {...sceneTransitions.clipPolygon}
    >
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#CC0000 2px, transparent 2px)', backgroundSize: '30px 30px' }} />

      {/* Main Image */}
      <motion.div
        className="absolute left-[10%] top-[15%] w-[45vw] h-[60vh]"
        initial={{ x: -100, opacity: 0, rotate: -5 }}
        animate={phase >= 1 ? { x: 0, opacity: 1, rotate: 0 } : { x: -100, opacity: 0, rotate: -5 }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/missing_diamond.png`} 
          alt="Missing Diamond"
          className="w-full h-full object-contain drop-shadow-2xl"
        />
      </motion.div>

      {/* Comic Book Text Box */}
      <motion.div
        className="absolute right-[10%] top-[40%] bg-[var(--color-accent)] comic-border p-8 max-w-[30vw] transform rotate-2"
        initial={{ scale: 0, opacity: 0 }}
        animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 15 }}
      >
        <motion.h2 
          className="text-[4vw] text-black font-display leading-tight"
          initial={{ opacity: 0 }}
          animate={phase >= 3 ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          THE DIAMOND IS GONE.
        </motion.h2>
      </motion.div>
    </motion.div>
  );
}
