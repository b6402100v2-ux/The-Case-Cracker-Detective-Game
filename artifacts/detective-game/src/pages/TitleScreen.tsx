import { useState, useEffect } from "react";

interface TitleScreenProps {
  onStart: () => void;
}

export default function TitleScreen({ onStart }: TitleScreenProps) {
  const [visible, setVisible] = useState(false);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine((s) => (s + 1) % 3);
    }, 600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative panels */}
      <div className="absolute top-4 left-4 w-32 h-20 comic-panel opacity-20 bg-accent/10" />
      <div className="absolute top-4 right-4 w-24 h-28 comic-panel-pink opacity-20" />
      <div className="absolute bottom-8 left-8 w-28 h-16 comic-panel-cyan opacity-20" />
      <div className="absolute bottom-4 right-6 w-20 h-24 comic-panel-yellow opacity-20" />

      {/* Main title panel */}
      <div
        className={`comic-panel bg-card max-w-2xl w-full p-0 overflow-hidden transition-all duration-700 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Yellow header bar */}
        <div className="bg-primary px-6 py-3 border-b-4 border-foreground">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-primary-foreground tracking-widest">CASE #101</span>
            <span className="text-xs font-mono font-bold text-primary-foreground tracking-widest">TOP SECRET</span>
          </div>
        </div>

        <div className="p-8 text-center">
          {/* Agency logo */}
          <div className="mb-2">
            <span className="text-accent text-sm tracking-[0.3em] font-mono uppercase">
              ★ Presents ★
            </span>
          </div>

          {/* Main Title */}
          <h1
            className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-1 flicker"
            style={{
              color: "hsl(45 100% 55%)",
              textShadow: "4px 4px 0px hsl(310 80% 40%), 8px 8px 0px rgba(0,0,0,0.4)",
              fontFamily: "'Bangers', cursive",
              letterSpacing: "0.05em",
            }}
          >
            YOUTH
          </h1>
          <h1
            className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-1"
            style={{
              color: "hsl(195 100% 55%)",
              textShadow: "4px 4px 0px hsl(195 60% 25%), 8px 8px 0px rgba(0,0,0,0.4)",
              fontFamily: "'Bangers', cursive",
              letterSpacing: "0.05em",
            }}
          >
            DETECTIVE
          </h1>
          <h1
            className="text-6xl md:text-7xl font-black tracking-tight leading-none mb-6"
            style={{
              color: "hsl(310 80% 65%)",
              textShadow: "4px 4px 0px hsl(310 60% 30%), 8px 8px 0px rgba(0,0,0,0.4)",
              fontFamily: "'Bangers', cursive",
              letterSpacing: "0.05em",
            }}
          >
            AGENCY
          </h1>

          {/* Subtitle */}
          <div className="comic-panel-yellow inline-block px-4 py-2 mb-8 skew-heading">
            <p className="text-foreground text-lg tracking-widest font-mono font-bold">
              CASE #101: THE SILENT NOTIFICATION
            </p>
          </div>

          {/* Narration box */}
          <div className="bg-foreground/10 border-2 border-foreground/30 p-4 mb-8 text-left font-mono text-sm leading-relaxed">
            <span className="text-primary font-bold">NARRATOR: </span>
            <span className="text-muted-foreground">
              Somewhere in the digital shadows, a crime is unfolding. A girl named Maya is in critical
              condition. The evidence is fragmented across four locations. Only a squad of sharp minds
              can piece together the truth.
            </span>
          </div>

          {/* Scan line indicator */}
          <div className="flex justify-center gap-3 mb-8">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full border-2 border-foreground transition-all duration-300 ${
                  scanLine === i ? "bg-primary scale-150" : "bg-transparent"
                }`}
              />
            ))}
          </div>

          {/* Start button */}
          <button
            onClick={onStart}
            className="comic-panel bg-primary text-primary-foreground px-10 py-4 text-2xl font-black tracking-widest uppercase hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-100 active:scale-95 glow-pulse"
            style={{ boxShadow: "5px 5px 0px hsl(45 100% 30%)" }}
          >
            BEGIN INVESTIGATION
          </button>
        </div>

        {/* Bottom bar */}
        <div className="bg-secondary/20 px-6 py-2 border-t-4 border-foreground text-center">
          <span className="text-xs font-mono text-muted-foreground tracking-widest">
            FOR 4 DETECTIVES — READING SKILLS REQUIRED
          </span>
        </div>
      </div>

      {/* Corner decorations */}
      <div
        className="absolute top-1/4 left-6 text-4xl rotate-[-15deg] opacity-60"
        style={{ filter: "drop-shadow(2px 2px 0px hsl(310 80% 40%))" }}
      >
        ★
      </div>
      <div
        className="absolute top-1/3 right-8 text-3xl rotate-[20deg] opacity-60"
        style={{ filter: "drop-shadow(2px 2px 0px hsl(195 100% 35%))" }}
      >
        ★
      </div>
    </div>
  );
}
