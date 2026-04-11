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
    const t2 = setTimeout(() => setShowVerdict(true), 1000);
    const t3 = setTimeout(() => setShowClosed(true), 2000);
    const t4 = setTimeout(() => setShowReset(true), 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const correctCount = state.panelCorrect.filter(Boolean).length;

  const badgeColor =
    correctCount === 4
      ? "hsl(195 100% 55%)"
      : correctCount >= 3
      ? "hsl(45 100% 55%)"
      : correctCount >= 2
      ? "hsl(310 80% 55%)"
      : "hsl(0 84% 60%)";

  const badgeLabel =
    correctCount === 4
      ? "MASTER DETECTIVE"
      : correctCount >= 3
      ? "SHARP INVESTIGATOR"
      : correctCount >= 2
      ? "FIELD AGENT"
      : "TRAINEE";

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative splashes */}
      <div className="absolute top-8 left-8 sfx-burst text-sm opacity-40" style={{ background: "hsl(195 100% 55%)", color: "hsl(45 20% 8%)" }}>
        CASE CLOSED!
      </div>
      <div className="absolute bottom-12 right-8 sfx-burst text-sm opacity-40" style={{ background: "hsl(310 80% 55%)", color: "white" }}>
        SOLVED!
      </div>

      <div className="comic-panel bg-card max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-foreground px-6 py-4 border-b-4 border-foreground text-center">
          <div
            className={`inline-block sfx-burst text-2xl mb-2 ${revealed ? "stamp-in" : "opacity-0"}`}
            style={{ background: badgeColor, color: "hsl(45 20% 8%)" }}
          >
            CASE CLOSED
          </div>
          <h2
            className="text-4xl font-black"
            style={{
              color: "hsl(45 100% 55%)",
              textShadow: "3px 3px 0px hsl(310 80% 40%)",
              fontFamily: "'Bangers', cursive",
            }}
          >
            CASE FILE: {state.squadName || "UNKNOWN SQUAD"}
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Badge */}
          <div
            className={`text-center transition-all duration-700 ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
          >
            <div
              className="inline-block border-4 px-6 py-3 text-2xl font-black tracking-widest rotate-[-3deg]"
              style={{ borderColor: badgeColor, color: badgeColor, fontFamily: "'Bangers', cursive" }}
            >
              {badgeLabel}
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
                className={`border-2 p-3 transition-all duration-500 ${
                  state.panelCorrect[i] ? "border-accent bg-accent/10" : "border-destructive/40 bg-destructive/5"
                }`}
                style={{ transitionDelay: `${i * 150 + 300}ms`, opacity: revealed ? 1 : 0, transform: revealed ? "none" : "translateY(10px)" }}
              >
                <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                  {d.name || `Detective ${i + 1}`}
                </p>
                <p className={`font-black text-lg ${state.panelCorrect[i] ? "text-accent" : "text-destructive"}`}>
                  {state.panelCorrect[i] ? "✓ SOLVED" : "✗ MISSED"}
                </p>
                {state.panelAnswers[i] && (
                  <p className="text-xs font-mono text-foreground/60 truncate">
                    "{state.panelAnswers[i]}"
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Verdict */}
          {showVerdict && (
            <div className="slide-up comic-panel-yellow p-4">
              <p className="text-primary text-xs font-mono font-bold tracking-widest uppercase mb-2">
                SQUAD CONCLUSION:
              </p>
              <p className="font-mono text-sm text-foreground/80 italic">
                "{state.finalVerdict}"
              </p>
            </div>
          )}

          {/* Narrator ending */}
          {showClosed && (
            <div className="slide-up bg-foreground/5 border-l-4 border-accent p-4 font-mono text-sm leading-relaxed">
              <span className="text-primary font-bold">NARRATOR: </span>
              <span className="text-muted-foreground">
                The evidence is clear. With your help, the police have identified the source of the
                harassment. The Whisper app account has been shut down. Maya is recovering and receiving
                support. The word "bystander" no longer applies to Squad {state.squadName || "UNKNOWN"}.
              </span>
              <br /><br />
              <span className="text-accent font-bold">REMEMBER: </span>
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
                style={{
                  color: "hsl(45 100% 55%)",
                  textShadow: "3px 3px 0px hsl(310 80% 40%)",
                  fontFamily: "'Bangers', cursive",
                  letterSpacing: "0.15em",
                }}
              >
                — THE END —
              </span>
            </div>
          )}

          {/* Replay */}
          {showReset && (
            <button
              onClick={resetGame}
              className="slide-up comic-panel w-full bg-secondary text-secondary-foreground py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
              style={{ boxShadow: "4px 4px 0px hsl(310 60% 30%)" }}
            >
              ↩ PLAY AGAIN
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
