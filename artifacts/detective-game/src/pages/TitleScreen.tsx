import { useState, useEffect } from "react";

interface TitleScreenProps {
  onStart: () => void;
  onTeacherView: () => void;
}

export default function TitleScreen({ onStart, onTeacherView }: TitleScreenProps) {
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
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      <div
        className={`comic-panel bg-card max-w-lg w-full overflow-hidden transition-all duration-700 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <div className="px-5 py-2 border-b-4 border-foreground flex items-center justify-between" style={{ background: "hsl(48 100% 50%)" }}>
          <span className="text-xs font-mono font-black text-foreground tracking-widest">CASE #101</span>
          <span className="text-xs font-mono font-black text-foreground tracking-widest">A COLLABORATIVE READING MYSTERY</span>
        </div>

        <div className="p-6 text-center bg-card">
          <div className="mb-4">
            <div className="inline-block px-5 py-2 skew-heading border-4 border-foreground" style={{ background: "hsl(48 100% 50%)" }}>
              <span className="text-base font-black tracking-[0.2em] text-foreground uppercase">
                THE CASE CRACKERS
              </span>
            </div>
          </div>

          <p className="font-mono text-xs text-muted-foreground tracking-widest mb-2 uppercase">
            Case #101 — The Silent Notification
          </p>

          <h1
            className="text-6xl md:text-7xl font-black leading-none mb-0 flicker"
            style={{
              color: "hsl(354 78% 44%)",
              textShadow: "3px 3px 0px hsl(354 60% 25%)",
              fontFamily: "'Bangers', cursive",
              letterSpacing: "0.04em",
            }}
          >
            THE SILENT
          </h1>
          <h1
            className="text-6xl md:text-7xl font-black leading-none mb-5"
            style={{
              color: "hsl(210 80% 40%)",
              textShadow: "3px 3px 0px hsl(210 60% 20%)",
              fontFamily: "'Bangers', cursive",
              letterSpacing: "0.04em",
            }}
          >
            NOTIFICATION
          </h1>

          <div className="border-4 border-foreground p-4 mb-6 text-left" style={{ background: "hsl(48 100% 50%)" }}>
            <p className="font-mono text-sm leading-relaxed text-foreground font-bold italic">
              A girl named Maya is in critical condition. The digital evidence
              is fragmented. Split up. Find the truth. <strong>Together.</strong>
            </p>
          </div>

          <div className="flex justify-center gap-6 mb-5 text-sm font-mono text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>🥉</span>
              <span className="text-xs">3+ correct = Panel Badge</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🏆</span>
              <span className="text-xs">7–9 badges = Great Detectives!</span>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <span className="font-black text-lg tracking-wider" style={{ color: "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>THWACK!</span>
            <span className="font-black text-lg tracking-wider" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>KRA-KOOOM!</span>
            <span className="font-black text-lg tracking-wider px-3 py-0.5 border-4 border-foreground" style={{ background: "hsl(48 100% 50%)", fontFamily: "'Bangers', cursive" }}>CLICK</span>
          </div>

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full border-2 border-foreground transition-all duration-300 ${
                  scanLine === i ? "scale-150" : "bg-transparent"
                }`}
                style={scanLine === i ? { background: "hsl(354 78% 44%)" } : {}}
              />
            ))}
          </div>

          <button
            onClick={onStart}
            className="comic-panel w-full text-white py-4 text-2xl font-black tracking-widest uppercase hover:translate-x-1 hover:translate-y-1 transition-all duration-100 active:scale-95 glow-pulse mb-3"
            style={{
              background: "hsl(354 78% 44%)",
              boxShadow: "5px 5px 0px hsl(354 78% 28%)",
            }}
          >
            BEGIN INVESTIGATION →
          </button>

          <button
            onClick={onTeacherView}
            className="w-full border-2 border-foreground py-2.5 text-sm font-black tracking-widest uppercase hover:bg-muted transition-colors font-mono"
          >
            📋 TEACHER LEADERBOARD
          </button>
        </div>

        <div className="flex h-3">
          <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
          <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
          <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
          <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        </div>
      </div>
    </div>
  );
}
