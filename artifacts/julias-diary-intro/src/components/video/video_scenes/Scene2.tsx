import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 1200),
      setTimeout(() => setPhase(3), 2000),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const words = "EVERY WORD HIDES A CLUE.".split(" ");

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0A0A0A]"
      {...sceneTransitions.wipe}
    >
      {/* Background handwriting texture sliding */}
      <motion.div 
        className="absolute inset-[-50%]"
        initial={{ x: '0%', y: '0%', rotate: -5 }}
        animate={{ x: '-10%', y: '-10%' }}
        transition={{ duration: 10, ease: 'linear' }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/handwriting_texture.png`} 
          className="w-full h-full object-cover opacity-30 mix-blend-luminosity"
          alt="Handwriting"
        />
      </motion.div>

      {/* Highlight bars mimicking redaction or highlighting */}
      {phase >= 1 && (
        <motion.div 
          className="absolute top-1/4 left-0 w-full h-[15vh] bg-[var(--color-primary)]/40 mix-blend-multiply"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 3, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
        />
      )}

      {/* Foreground typography */}
      <div className="relative z-10 w-full px-[10vw] flex flex-wrap justify-center gap-[2vw]">
        {words.map((word, i) => (
          <motion.div
            key={i}
            className="text-[8vw] font-display text-white text-stroke leading-none uppercase"
            initial={{ opacity: 0, y: 50, rotateZ: i % 2 === 0 ? 5 : -5 }}
            animate={phase >= 2 ? { opacity: 1, y: 0, rotateZ: i % 2 === 0 ? -2 : 2 } : { opacity: 0, y: 50, rotateZ: i % 2 === 0 ? 5 : -5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20, delay: phase >= 2 ? i * 0.2 : 0 }}
            style={{ 
              textShadow: '4px 4px 0px var(--color-primary)' 
            }}
          >
            {word}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
