import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { sceneTransitions } from '@/lib/video';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),  // Suspects reveal
      setTimeout(() => setPhase(2), 1800), // Question text
      setTimeout(() => setPhase(3), 4000), // Exit drift
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[var(--color-bg-dark)] overflow-hidden"
      {...sceneTransitions.slideUp}
    >
      {/* Dynamic Background */}
      <motion.div 
        className="absolute inset-0 bg-[#003399]"
        initial={{ scale: 1.5, opacity: 0.5 }}
        animate={{ scale: 1, opacity: 0.8 }}
        transition={{ duration: 5, ease: "easeOut" }}
      >
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMCAwTDggOFpNOCAwTDAgOFoiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] mix-blend-overlay" />
      </motion.div>

      {/* Suspects Image */}
      <motion.div
        className="absolute bottom-0 w-[80vw] h-[80vh] flex justify-center items-end"
        initial={{ y: "100%" }}
        animate={phase >= 1 ? { y: 0 } : { y: "100%" }}
        transition={{ type: 'spring', stiffness: 80, damping: 20 }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/suspects.png`} 
          alt="Suspects"
          className="w-full h-full object-contain object-bottom drop-shadow-[0_0_30px_rgba(204,0,0,0.6)]"
        />
      </motion.div>

      {/* Bold Text */}
      <motion.h1
        className="absolute top-[15%] text-[10vw] text-white font-display comic-text-shadow z-20 text-center w-full"
        initial={{ scale: 2, opacity: 0 }}
        animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 2, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      >
        WHO TOOK IT?
      </motion.h1>
    </motion.div>
  );
}
