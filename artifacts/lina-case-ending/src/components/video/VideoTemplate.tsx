import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = { 
  verdict: 5000, 
  truth: 6000, 
  celebration: 6000, 
  lesson: 7000, 
  final: 6000 
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="w-full h-screen overflow-hidden relative bg-bg-dark font-body">
      
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          className="absolute w-full h-full opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle at center, var(--color-secondary) 0%, transparent 70%)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        
        {/* Halftone texture overlay */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay"
          style={{
            backgroundImage: `radial-gradient(var(--color-text-primary) 1px, transparent 1px)`,
            backgroundSize: '10px 10px'
          }}
        />
      </div>

      {/* Dynamic persistent accents */}
      <motion.div
        className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full blur-[100px] mix-blend-screen pointer-events-none"
        animate={{
          background: currentScene === 0 ? 'radial-gradient(circle, var(--color-primary), transparent)' :
                      currentScene === 1 ? 'radial-gradient(circle, var(--color-secondary), transparent)' :
                      currentScene === 2 ? 'radial-gradient(circle, var(--color-accent), transparent)' :
                      currentScene === 3 ? 'radial-gradient(circle, #000, transparent)' :
                      'radial-gradient(circle, var(--color-primary), transparent)',
          x: ['-20vw', '40vw', '-10vw', '30vw', '50vw'][currentScene],
          y: ['-10vh', '-20vh', '40vh', '10vh', '30vh'][currentScene],
          scale: [1, 1.5, 1.2, 1.8, 1][currentScene],
          opacity: [0.6, 0.4, 0.8, 0.3, 0.5][currentScene]
        }}
        transition={{ duration: 2, ease: "easeInOut" }}
      />

      {/* Scene Content */}
      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="verdict" />}
        {currentScene === 1 && <Scene2 key="truth" />}
        {currentScene === 2 && <Scene3 key="celebration" />}
        {currentScene === 3 && <Scene4 key="lesson" />}
        {currentScene === 4 && <Scene5 key="final" />}
      </AnimatePresence>

    </div>
  );
}
