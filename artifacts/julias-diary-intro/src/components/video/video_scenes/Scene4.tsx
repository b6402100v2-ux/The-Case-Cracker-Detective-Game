import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  const phrases = [
    { text: "READ CAREFULLY.", color: "var(--color-accent)" },
    { text: "FIND THE MAIN IDEA.", color: "var(--color-primary)" },
    { text: "CRACK THE CASE.", color: "white" }
  ];

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-black"
      {...sceneTransitions.zoomThrough}
    >
      {/* Dynamic diagonal background cuts */}
      <motion.div 
        className="absolute inset-0 bg-[var(--color-primary)] origin-bottom-left"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: phase >= 2 ? 1.5 : 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}
      />
      <motion.div 
        className="absolute inset-0 bg-[var(--color-secondary)] origin-top-right"
        initial={{ scaleY: 0 }}
        animate={{ scaleY: phase >= 3 ? 1.5 : 0 }}
        transition={{ duration: 0.8, ease: 'circOut' }}
        style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full w-full">
        <div className="h-[20vh] relative flex items-center justify-center w-full">
          <motion.h2 
            className="text-[9vw] font-display text-stroke-thick absolute uppercase"
            style={{ color: phrases[0].color, textShadow: '6px 6px 0px #000' }}
            initial={{ opacity: 0, scale: 3 }}
            animate={phase >= 1 && phase < 2 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: phase >= 2 ? 0.5 : 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {phrases[0].text}
          </motion.h2>

          <motion.h2 
            className="text-[9vw] font-display text-stroke-thick absolute uppercase"
            style={{ color: phrases[1].color, textShadow: '6px 6px 0px #000' }}
            initial={{ opacity: 0, scale: 3 }}
            animate={phase >= 2 && phase < 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: phase >= 3 ? 0.5 : 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {phrases[1].text}
          </motion.h2>

          <motion.h2 
            className="text-[11vw] font-display text-stroke-thick absolute uppercase text-center w-full"
            style={{ color: phrases[2].color, textShadow: '8px 8px 0px #000' }}
            initial={{ opacity: 0, scale: 3 }}
            animate={phase >= 3 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {phrases[2].text}
          </motion.h2>
        </div>
      </div>
    </motion.div>
  );
}
