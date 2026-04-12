import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { sceneTransitions } from '@/lib/video/animations';

export function Scene3() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),   // Video & Badge
      setTimeout(() => setPhase(2), 600),   // Comic elements burst
      setTimeout(() => setPhase(3), 1200),  // "POW!" / "CRACKED IT!"
      setTimeout(() => setPhase(4), 5000),  // Exit
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#800000]"
      {...sceneTransitions.morphExpand}
    >
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video 
          src={`${import.meta.env.BASE_URL}videos/confetti_burst.mp4`}
          className="w-full h-full object-cover opacity-80 mix-blend-screen"
          autoPlay muted loop playsInline
        />
      </div>

      {/* Comic burst background elements */}
      <motion.img 
        src={`${import.meta.env.BASE_URL}images/comic_elements.png`}
        className="absolute w-[120vw] h-[120vw] object-cover opacity-50 mix-blend-screen z-10"
        initial={{ scale: 0, rotate: -45 }}
        animate={phase >= 2 ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -45 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      />

      {/* Floating Badges */}
      {[...Array(5)].map((_, i) => (
        <motion.img
          key={i}
          src={`${import.meta.env.BASE_URL}images/detective_badge.png`}
          className="absolute w-[15vw] max-w-[200px] h-auto object-contain z-20 comic-shadow"
          initial={{ opacity: 0, y: 100, scale: 0 }}
          animate={phase >= 1 ? { 
            opacity: 0.8, 
            y: [50, -20, 50],
            x: [(i - 2) * 20 + 'vw', (i - 2) * 22 + 'vw', (i - 2) * 20 + 'vw'],
            scale: [0.8, 1, 0.8],
            rotate: [i * 15, i * 15 + 20, i * 15]
          } : { opacity: 0, y: 100, scale: 0 }}
          transition={{ 
            opacity: { duration: 0.4 },
            scale: { type: "spring" },
            default: { duration: 4 + i, repeat: Infinity, ease: "easeInOut" } 
          }}
        />
      ))}

      {/* Kinetic Typography */}
      <div className="relative z-30 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={phase >= 3 ? { scale: 1, rotate: -5 } : { scale: 0, rotate: -20 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="bg-accent px-12 py-6 border-8 border-black comic-shadow shadow-primary/80"
          style={{ clipPath: 'polygon(0% 10%, 100% 0%, 95% 90%, 5% 100%)' }}
        >
          <h1 className="text-[12vw] font-display text-bg-light uppercase leading-none tracking-widest text-stroke-thick mb-2">
            CRACKED IT!
          </h1>
          <p className="text-[4vw] font-display text-black text-center leading-none tracking-wide">
            THE DETECTIVES WIN
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
}
