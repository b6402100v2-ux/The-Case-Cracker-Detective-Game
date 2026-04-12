import { useRef, useState, useEffect, useCallback } from "react";

interface Props {
  onFinish: () => void;
}

export default function IntroScreen({ onFinish }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  // Start playback (muted first — required by browser autoplay policy)
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
    const onTime = () => {
      if (v.duration) setProgress(v.currentTime / v.duration);
    };
    v.addEventListener("timeupdate", onTime);
    return () => v.removeEventListener("timeupdate", onTime);
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }, []);

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
      {/* Video fills the screen */}
      <video
        ref={videoRef}
        src="/intro.mp4"
        playsInline
        onEnded={onFinish}
        className="w-full h-full object-contain"
        style={{ maxHeight: "100dvh" }}
      />

      {/* Overlay controls */}
      <div className="fixed inset-0 z-10 flex flex-col justify-between p-4 pointer-events-none">
        {/* Top: mute + skip */}
        <div className="flex items-start justify-between pointer-events-auto">
          <button
            onClick={toggleMute}
            className="bg-black/60 text-white border border-white/30 px-3 py-1.5 text-sm font-mono font-black uppercase tracking-widest hover:bg-black/80 transition-colors backdrop-blur-sm"
          >
            {muted ? "🔇 UNMUTE" : "🔊 MUTE"}
          </button>

          <button
            onClick={onFinish}
            className="bg-black/60 text-white border border-white/30 px-4 py-1.5 text-sm font-mono font-black uppercase tracking-widest hover:bg-white hover:text-black transition-colors backdrop-blur-sm"
          >
            SKIP ▶▶
          </button>
        </div>

        {/* Bottom: progress bar + label */}
        <div className="pointer-events-none">
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/80 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className="text-white/50 font-mono text-xs text-center mt-2 tracking-widest uppercase">
            The Case Crackers — Case #101
          </p>
        </div>
      </div>
    </div>
  );
}
