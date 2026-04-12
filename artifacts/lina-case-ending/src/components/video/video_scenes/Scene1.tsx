import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene1() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // gavel appears
      setTimeout(() => setPhase(2), 1500),  // slam & flash
      setTimeout(() => setPhase(3), 2000),  // CASE text
      setTimeout(() => setPhase(4), 2300),  // SOLVED text
      setTimeout(() => setPhase(5), 4000),  // start exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      {...sceneTransitions.clipCircle}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          src={`${import.meta.env.BASE_URL}videos/dramatic_light_sweep.mp4`}
          className="w-full h-full object-cover opacity-60 mix-blend-screen"
          autoPlay muted loop playsInline
        />
      </div>

      {/* Red flash on slam */}
      <motion.div 
        className="absolute inset-0 bg-primary z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase === 2 ? 0.8 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Gavel */}
      <motion.div 
        className="absolute z-20 w-[40vw] max-w-[500px]"
        initial={{ y: -500, rotate: 45, opacity: 0 }}
        animate={
          phase === 0 ? { y: -500, rotate: 45, opacity: 0 } :
          phase === 1 ? { y: -100, rotate: 20, opacity: 1 } :
          phase >= 2 ? { y: 50, rotate: -30, opacity: 0.2, scale: 1.5, filter: "blur(10px)" } : {}
        }
        transition={{ 
          duration: phase === 2 ? 0.15 : 0.8, 
          ease: phase === 2 ? "easeIn" : "easeOut" 
        }}
      >
        <img 
          src={`${import.meta.env.BASE_URL}images/courtroom_gavel.png`} 
          alt="Gavel" 
          className="w-full h-auto object-contain comic-shadow drop-shadow-2xl"
        />
      </motion.div>

      {/* Text */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none">
        <motion.h1 
          className="text-[15vw] font-display text-bg-light uppercase leading-none tracking-tighter text-stroke-thick comic-shadow"
          initial={{ scale: 3, opacity: 0, y: 100 }}
          animate={phase >= 3 ? { scale: 1, opacity: 1, y: 0, rotate: -2 } : { scale: 3, opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          CASE
        </motion.h1>
        
        <motion.h1 
          className="text-[18vw] font-display text-accent uppercase leading-none tracking-tighter text-stroke-thick comic-shadow -mt-4"
          initial={{ scale: 3, opacity: 0, y: 100 }}
          animate={phase >= 4 ? { scale: 1, opacity: 1, y: 0, rotate: 3 } : { scale: 3, opacity: 0, y: 100 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          SOLVED
        </motion.h1>
      </div>

    </motion.div>
  );
}
