import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),   // Left panel slides in
      setTimeout(() => setPhase(2), 800),   // Right panel slides in
      setTimeout(() => setPhase(3), 2000),  // Confirmation stamp appears
      setTimeout(() => setPhase(4), 5000),  // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 overflow-hidden bg-bg-dark"
      {...sceneTransitions.splitHorizontal}
    >
      {/* Comic Book Split Screen */}
      <div className="absolute inset-0 flex">
        
        {/* Left Panel: Lina Silhouette */}
        <motion.div 
          className="w-1/2 h-full relative bg-secondary border-r-8 border-black overflow-hidden flex items-center justify-center"
          initial={{ x: "-100%" }}
          animate={phase >= 1 ? { x: 0 } : { x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '15px 15px' }} />
          
          <motion.div 
            className="w-2/3 h-full relative flex items-end justify-center"
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Abstract silhouette */}
            <div className="w-[30vw] h-[50vh] bg-black rounded-t-full opacity-80 comic-shadow" />
            <div className="absolute top-1/4 w-[15vw] h-[15vw] bg-black rounded-full opacity-80" />
          </motion.div>
        </motion.div>

        {/* Right Panel: Cyberbullying Symbols */}
        <motion.div 
          className="w-1/2 h-full relative bg-primary overflow-hidden flex items-center justify-center"
          initial={{ x: "100%" }}
          animate={phase >= 2 ? { x: 0 } : { x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="absolute inset-0 mix-blend-overlay opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '20px 20px' }} />
          
          <motion.img 
            src={`${import.meta.env.BASE_URL}images/cyberbullying_symbols.png`}
            alt="Cyberbullying Symbols"
            className="w-[80%] h-auto object-contain comic-shadow drop-shadow-2xl mix-blend-luminosity"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={phase >= 2 ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          />
        </motion.div>
      </div>

      {/* Confirmation Stamp */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
        <motion.div
          className="bg-black border-4 border-accent px-8 py-4 rotate-[-10deg] comic-shadow shadow-accent/50"
          initial={{ scale: 5, opacity: 0 }}
          animate={phase >= 3 ? { scale: 1, opacity: 1 } : { scale: 5, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 15 }}
        >
          <h2 className="text-[6vw] font-display text-accent leading-none tracking-wider text-stroke">
            CYBERBULLYING
          </h2>
          <h3 className="text-[4vw] font-display text-bg-light leading-none text-center tracking-widest text-stroke">
            CONFIRMED
          </h3>
        </motion.div>
      </div>

    </motion.div>
  );
}
