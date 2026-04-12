import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),   // Line 1
      setTimeout(() => setPhase(2), 2500),  // Line 2
      setTimeout(() => setPhase(3), 4500),  // Line 3
      setTimeout(() => setPhase(4), 6000),  // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-bg-dark px-12"
      {...sceneTransitions.fadeBlur}
    >
      {/* Calm Starfield Background (CSS fallback since video failed, or dark gradient) */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#001133] to-bg-dark opacity-80" />
        {/* Subtle animated stars */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 4 + 1 + 'px',
              height: Math.random() * 4 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{ duration: Math.random() * 3 + 2, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-12 items-center text-center">
        
        {/* Line 1 */}
        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-[5vw] font-display text-accent tracking-wider text-stroke comic-shadow">
            Words have power.
          </h2>
        </motion.div>

        {/* Line 2 */}
        <motion.div 
          className="overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h2 className="text-[4.5vw] font-display text-bg-light tracking-wider text-stroke comic-shadow">
            Online or offline — kindness matters.
          </h2>
        </motion.div>

        {/* Line 3 */}
        <motion.div 
          className="overflow-hidden mt-8"
          initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          animate={phase >= 3 ? { opacity: 1, scale: 1, filter: "blur(0px)" } : { opacity: 0, scale: 0.9, filter: "blur(10px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-[6vw] font-display text-primary tracking-widest text-stroke-thick comic-shadow bg-bg-light/10 px-8 py-4 rounded-xl border-2 border-primary/30">
            You spoke up. <br/><span className="text-accent">That's what heroes do.</span>
          </h2>
        </motion.div>

      </div>
    </motion.div>
  );
}
