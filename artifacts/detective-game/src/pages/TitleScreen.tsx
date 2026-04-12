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
        {/* Top strip */}
        <div className="px-5 py-2 border-b-4 border-foreground flex items-center justify-center" style={{ background: "hsl(48 100% 50%)" }}>
          <span className="text-xs font-mono font-black text-foreground tracking-widest uppercase">A Collaborative Reading Mystery</span>
        </div>

        <div className="p-6 text-center bg-card">

          {/* Big title */}
          <div className="mb-5">
            <h1
              className="text-6xl md:text-7xl font-black leading-none flicker"
              style={{
                color: "hsl(354 78% 44%)",
                textShadow: "4px 4px 0px hsl(354 60% 25%)",
                fontFamily: "'Bangers', cursive",
                letterSpacing: "0.06em",
              }}
            >
              THE CASE
            </h1>
            <h1
              className="text-6xl md:text-7xl font-black leading-none"
              style={{
                color: "hsl(210 80% 40%)",
                textShadow: "4px 4px 0px hsl(210 60% 20%)",
                fontFamily: "'Bangers', cursive",
                letterSpacing: "0.06em",
              }}
            >
              CRACKERS
            </h1>
          </div>

          {/* Cartoonish words */}
          <div className="flex justify-center gap-4 mb-5">
            <span className="font-black text-lg tracking-wider" style={{ color: "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>THWACK!</span>
            <span className="font-black text-lg tracking-wider" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>KRA-KOOOM!</span>
            <span className="font-black text-lg tracking-wider px-3 py-0.5 border-4 border-foreground" style={{ background: "hsl(48 100% 50%)", fontFamily: "'Bangers', cursive" }}>CLICK</span>
          </div>

          {/* Rules */}
          <div className="border-4 border-foreground p-4 mb-4 text-left" style={{ background: "hsl(210 80% 95%)" }}>
            <p className="font-mono text-xs font-black tracking-widest uppercase mb-2" style={{ color: "hsl(210 80% 40%)" }}>
              ▶ HOW TO PLAY
            </p>
            <div className="space-y-1.5">
              {[
                "👥  4 detectives — each reads 1 diary panel",
                "❓  Answer 5 questions about your panel",
                "✗   Wrong answer? Restart from Q1",
                "🏆  Zero wrong answers = Panel Badge",
                "🗳️  Assemble to discuss, then vote as a team",
                "⚡  Unanimous correct vote = Team Badges!",
              ].map((rule, i) => (
                <p key={i} className="font-mono text-xs text-foreground leading-snug">{rule}</p>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="border-4 border-foreground p-4 mb-5 text-left" style={{ background: "hsl(48 100% 92%)" }}>
            <p className="font-mono text-xs font-black tracking-widest uppercase mb-2" style={{ color: "hsl(48 100% 35%)" }}>
              ▶ AWARDS
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {[
                { badges: "7–9 badges", rank: "🏆 GREAT DETECTIVES" },
                { badges: "4–6 badges", rank: "🥇 Good Investigators" },
                { badges: "1–3 badges", rank: "🥈 Field Agents" },
                { badges: "0 badges", rank: "🥉 Rookie Squad" },
              ].map((row, i) => (
                <div key={i} className="font-mono text-xs leading-snug">
                  <span className="text-muted-foreground">{row.badges} → </span>
                  <span className="font-black text-foreground">{row.rank}</span>
                </div>
              ))}
            </div>
            <p className="font-mono text-[10px] text-muted-foreground mt-2 border-t border-foreground/10 pt-2">
              Verdict Round 1 correct = +5 team badges · Round 2 = +3
            </p>
          </div>

          {/* Scan dots */}
          <div className="flex justify-center gap-3 mb-5">
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

          {/* CTA buttons */}
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
