import { useState, useEffect } from "react";
import { useGame } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function CollaborationScreen() {
  const { state, setFinalVerdict, submitVerdict } = useGame();
  const [verdict, setVerdict] = useState("");
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(true);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);
  const [assembled, setAssembled] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setAssembled(true), 200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor =
    timeLeft < 60 ? "hsl(354 78% 44%)" :
    timeLeft < 180 ? "hsl(48 100% 40%)" :
    "hsl(210 80% 40%)";

  const toggleReveal = (i: number) => {
    setRevealed((r) => r.map((v, idx) => (idx === i ? !v : v)));
  };

  const handleSubmit = () => {
    if (!verdict.trim()) {
      setError("Your squad must submit a verdict!");
      return;
    }
    setFinalVerdict(verdict);
    submitVerdict();
  };

  const accentColors = [
    "hsl(354 78% 44%)",
    "hsl(210 80% 40%)",
    "hsl(48 100% 45%)",
    "hsl(354 78% 44%)",
  ];
  const accentBg = [
    "hsl(354 78% 96%)",
    "hsl(210 80% 95%)",
    "hsl(48 100% 93%)",
    "hsl(354 78% 96%)",
  ];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Header */}
      <div className={`mb-5 text-center mt-5 transition-all duration-700 ${assembled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
        <div className="sfx-burst text-xl inline-block mb-3 font-black" style={{ background: "hsl(210 80% 40%)", color: "white" }}>
          KRA-KOOOM!
        </div>
        <h2
          className="text-5xl font-black tracking-widest"
          style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0px hsl(354 78% 28%)", fontFamily: "'Bangers', cursive" }}
        >
          PANELS REJOINING...
        </h2>
        <p className="text-muted-foreground font-mono text-sm tracking-widest mt-1">
          DETECTIVES, ASSEMBLE! — COMPARE YOUR CLUES
        </p>
      </div>

      {/* Timer */}
      <div className="comic-panel bg-card px-6 py-3 mb-5 flex items-center gap-4">
        <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Discussion Time:</span>
        <span className="font-mono text-3xl font-black" style={{ color: timerColor, fontFamily: "'Bangers', cursive" }}>
          {minutes}:{seconds}
        </span>
        <button
          onClick={() => setTimerActive((t) => !t)}
          className="text-xs font-mono border-2 border-foreground px-2 py-0.5 hover:bg-muted transition-colors"
        >
          {timerActive ? "PAUSE" : "RESUME"}
        </button>
      </div>

      {/* Clue reveal grid */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-5">
        {CLUES.map((clue, i) => (
          <div
            key={i}
            className="comic-panel bg-card overflow-hidden transition-all duration-500"
            style={{ opacity: assembled ? 1 : 0, transform: assembled ? "none" : "translateY(12px)", transitionDelay: `${i * 100 + 200}ms` }}
          >
            <div className="border-b-2 border-foreground px-4 py-2 flex items-center justify-between" style={{ background: accentColors[i] }}>
              <span className="text-sm font-black tracking-wide text-white">
                {clue.icon} {state.detectives[i]?.name || `Det. ${i + 1}`}
              </span>
              <span className="text-xs font-mono text-white/80">{clue.loc}</span>
            </div>
            <div className="p-3">
              <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-2">
                {clue.skill}
              </p>
              <button
                onClick={() => toggleReveal(i)}
                className="w-full text-left border-2 px-3 py-2 font-mono text-sm transition-all"
                style={revealed[i]
                  ? { borderColor: accentColors[i], background: accentBg[i], color: "hsl(0 0% 10%)" }
                  : { borderColor: "hsl(0 0% 80%)", background: "hsl(0 0% 98%)", color: "hsl(0 0% 50%)" }}
              >
                {revealed[i] ? (
                  <>
                    <span className="text-xs text-muted-foreground block mb-0.5">Answer:</span>
                    <span className="font-black">{state.panelAnswers[i] || "(no answer)"}</span>
                  </>
                ) : (
                  <span className="tracking-widest">[ CLICK TO REVEAL ]</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Timeline guide */}
      <div className="comic-panel-cyan bg-card max-w-2xl w-full p-4 mb-5">
        <p className="text-xs font-mono font-black tracking-widest uppercase mb-2" style={{ color: "hsl(210 80% 40%)" }}>
          ▶ Connect the Timeline:
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            `1. ${state.detectives[0]?.name || "Det. 1"}'s Date`,
            `2. ${state.detectives[1]?.name || "Det. 2"}'s 'They'`,
            `3. ${state.detectives[2]?.name || "Det. 3"}'s Topic`,
            `4. ${state.detectives[3]?.name || "Det. 4"}'s Tone`,
          ].map((item, i) => (
            <span key={i} className="bg-muted border border-foreground/20 px-2 py-1 text-xs font-mono text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Final verdict */}
      <div className="comic-panel bg-card max-w-2xl w-full p-5">
        <h3 className="font-black tracking-widest mb-1 uppercase text-lg" style={{ color: "hsl(354 78% 44%)" }}>
          Final Case Report
        </h3>
        <p className="text-muted-foreground font-mono text-xs mb-3">
          What was the primary cause of Maya's situation?
        </p>
        <textarea
          className="comic-input resize-none mb-3"
          style={{ minHeight: "80px" }}
          placeholder="e.g. Cyberbullying via the Whisper app escalated over two weeks, leading to..."
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          maxLength={300}
        />
        {error && <p className="font-mono text-sm mb-3" style={{ color: "hsl(354 78% 44%)" }}>✗ {error}</p>}
        <button
          onClick={handleSubmit}
          className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
          style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0px hsl(354 78% 28%)" }}
        >
          SUBMIT CASE REPORT →
        </button>
      </div>
    </div>
  );
}
