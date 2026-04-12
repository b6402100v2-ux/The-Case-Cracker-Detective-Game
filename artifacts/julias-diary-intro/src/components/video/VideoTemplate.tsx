import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';

const SCENE_DURATIONS = {
  open: 5000,
  secret: 6000,
  mystery: 6000,
  challenge: 7000,
  title: 6000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[var(--color-bg-dark)] font-body">
      
      {/* Persistent Background Layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 comic-dots" />
        
        {/* Drifting comic background elements */}
        <motion.div 
          className="absolute w-[80vw] h-[80vw] rounded-full blur-[100px] opacity-30"
          style={{ background: 'var(--color-primary)' }}
          animate={{
            x: ['-20%', '30%', '-10%'],
            y: ['-10%', '20%', '50%'],
            scale: [1, 1.2, 0.8]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div 
          className="absolute right-0 bottom-0 w-[60vw] h-[60vw] rounded-full blur-[80px] opacity-30"
          style={{ background: 'var(--color-secondary)' }}
          animate={{
            x: ['10%', '-20%', '15%'],
            y: ['10%', '-30%', '-10%']
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <AnimatePresence mode="popLayout">
        {currentScene === 0 && <Scene1 key="open" />}
        {currentScene === 1 && <Scene2 key="secret" />}
        {currentScene === 2 && <Scene3 key="mystery" />}
        {currentScene === 3 && <Scene4 key="challenge" />}
        {currentScene === 4 && <Scene5 key="title" />}
      </AnimatePresence>
    </div>
  );
}
