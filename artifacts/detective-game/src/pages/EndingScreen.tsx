import { useState, useEffect } from "react";
import { useGame } from "@/game/GameContext";

export default function EndingScreen() {
  const { state, resetGame } = useGame();
  const [revealed, setRevealed] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const [showClosed, setShowClosed] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300);
    const t2 = setTimeout(() => setShowVerdict(true), 900);
    const t3 = setTimeout(() => setShowClosed(true), 1800);
    const t4 = setTimeout(() => setShowReset(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const correctCount = state.panelCorrect.filter(Boolean).length;

  const badge =
    correctCount === 4 ? { label: "GOLD MEDAL", color: "hsl(48 100% 45%)", textColor: "hsl(0 0% 10%)" } :
    correctCount >= 3 ? { label: "PANEL BADGE", color: "hsl(210 80% 40%)", textColor: "white" } :
    correctCount >= 2 ? { label: "FIELD AGENT", color: "hsl(354 78% 44%)", textColor: "white" } :
    { label: "TRAINEE", color: "hsl(0 0% 60%)", textColor: "white" };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Decorative SFX */}
      <div className="fixed top-8 left-4 sfx-burst text-xs opacity-50 font-black" style={{ background: "hsl(210 80% 40%)", color: "white" }}>
        CASE CLOSED!
      </div>
      <div className="fixed bottom-10 right-4 sfx-burst text-xs opacity-50 font-black" style={{ background: "hsl(354 78% 44%)", color: "white" }}>
        SOLVED!
      </div>

      <div className="comic-panel bg-card max-w-xl w-full overflow-hidden mt-4">
        {/* Header */}
        <div className="border-b-4 border-foreground px-6 py-4 text-center" style={{ background: "hsl(354 78% 44%)" }}>
          <div className={`inline-block sfx-burst text-xl mb-2 font-black ${revealed ? "stamp-in" : "opacity-0"}`}
            style={{ background: badge.color, color: badge.textColor }}>
            CASE CLOSED
          </div>
          <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
            CASE FILE: {state.squadName || "UNKNOWN SQUAD"}
          </h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Badge */}
          <div className={`text-center transition-all duration-700 ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div
              className="inline-block border-4 px-6 py-2 text-2xl font-black tracking-widest rotate-[-3deg]"
              style={{ borderColor: badge.color, color: badge.color, fontFamily: "'Bangers', cursive" }}
            >
              {badge.label}
            </div>
            <p className="text-muted-foreground font-mono text-sm mt-2">
              {correctCount}/4 clues solved correctly
            </p>
          </div>

          {/* Individual scores */}
          <div className="grid grid-cols-2 gap-3">
            {state.detectives.map((d, i) => (
              <div
                key={i}
                className="border-2 p-3 transition-all duration-500"
                style={{
                  borderColor: state.panelCorrect[i] ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)",
                  background: state.panelCorrect[i] ? "hsl(210 80% 95%)" : "hsl(354 78% 97%)",
                  opacity: revealed ? 1 : 0,
                  transform: revealed ? "none" : "translateY(8px)",
                  transitionDelay: `${i * 120 + 200}ms`,
                }}
              >
                <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  {d.name || `Detective ${i + 1}`}
                </p>
                <p className="font-black text-base" style={{ color: state.panelCorrect[i] ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)" }}>
                  {state.panelCorrect[i] ? "✓ SOLVED" : "✗ MISSED"}
                </p>
                {state.panelAnswers[i] && (
                  <p className="text-xs font-mono text-muted-foreground truncate">"{state.panelAnswers[i]}"</p>
                )}
              </div>
            ))}
          </div>

          {/* Verdict */}
          {showVerdict && (
            <div className="slide-up border-4 border-foreground p-4" style={{ background: "hsl(48 100% 50%)" }}>
              <p className="text-xs font-mono font-black tracking-widest uppercase mb-2 text-foreground">
                SQUAD CONCLUSION:
              </p>
              <p className="font-mono text-sm text-foreground italic">
                "{state.finalVerdict}"
              </p>
            </div>
          )}

          {/* Narrator */}
          {showClosed && (
            <div className="slide-up border-l-4 p-4 font-mono text-sm leading-relaxed bg-muted" style={{ borderColor: "hsl(210 80% 40%)" }}>
              <span className="font-black" style={{ color: "hsl(354 78% 44%)" }}>NARRATOR: </span>
              <span className="text-muted-foreground">
                The evidence is clear. With your help, the harassment was identified. The Whisper account
                has been shut down. Maya is recovering and receiving support. The word "bystander" no
                longer applies to Squad {state.squadName || "UNKNOWN"}.
              </span>
              <br /><br />
              <span className="font-black" style={{ color: "hsl(210 80% 40%)" }}>REMEMBER: </span>
              <span className="text-muted-foreground">
                Cyberbullying is real. If you see something, say something.
              </span>
            </div>
          )}

          {/* THE END */}
          {showClosed && (
            <div className="text-center stamp-in">
              <span
                className="text-4xl font-black"
                style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive", letterSpacing: "0.15em" }}
              >
                — THE END —
              </span>
            </div>
          )}

          {/* Replay */}
          {showReset && (
            <button
              onClick={resetGame}
              className="slide-up comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
              style={{ background: "hsl(210 80% 40%)", boxShadow: "4px 4px 0 hsl(210 80% 25%)" }}
            >
              ↩ PLAY AGAIN
            </button>
          )}
        </div>

        {/* Bottom bar */}
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
