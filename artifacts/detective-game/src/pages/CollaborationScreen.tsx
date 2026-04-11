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
        if (t <= 1) {
          setTimerActive(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor =
    timeLeft < 60 ? "text-destructive" : timeLeft < 180 ? "text-primary" : "text-accent";

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

  const colorMap = ["border-secondary text-secondary", "border-accent text-accent", "border-primary text-primary", "border-secondary text-secondary"];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      {/* Assemble header */}
      <div
        className={`mb-6 text-center transition-all duration-700 ${
          assembled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="sfx-burst text-2xl inline-block mb-3" style={{ background: "hsl(195 100% 55%)", color: "hsl(45 20% 8%)" }}>
          KRA-KOOOM!
        </div>
        <h2
          className="text-5xl font-black tracking-widest"
          style={{
            color: "hsl(45 100% 55%)",
            textShadow: "3px 3px 0px hsl(310 80% 40%)",
            fontFamily: "'Bangers', cursive",
          }}
        >
          PANELS REJOINING...
        </h2>
        <p className="text-muted-foreground font-mono text-sm tracking-widest mt-2">
          DETECTIVES, ASSEMBLE! — COMPARE YOUR CLUES
        </p>
      </div>

      {/* Timer */}
      <div
        className={`comic-panel bg-card px-6 py-3 mb-6 flex items-center gap-4 ${timerActive ? "glow-pulse" : ""}`}
      >
        <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Discussion Time:</span>
        <span className={`font-mono text-3xl font-black ${timerColor}`}>
          {minutes}:{seconds}
        </span>
        <button
          onClick={() => setTimerActive((t) => !t)}
          className="text-xs font-mono text-muted-foreground border border-foreground/30 px-2 py-0.5 hover:text-foreground transition-colors"
        >
          {timerActive ? "PAUSE" : "RESUME"}
        </button>
      </div>

      {/* Clue reveal grid */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-6">
        {CLUES.map((clue, i) => (
          <div
            key={i}
            className={`comic-panel bg-card overflow-hidden transition-all duration-500 ${
              assembled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: `${i * 100 + 300}ms` }}
          >
            <div className={`border-b-2 border-foreground px-4 py-2 flex items-center justify-between`}>
              <span className={`text-sm font-black tracking-wide ${colorMap[i].split(" ")[1]}`}>
                {clue.icon} {state.detectives[i]?.name || `Det. ${i + 1}`}
              </span>
              <span className="text-xs font-mono text-muted-foreground">{clue.loc}</span>
            </div>
            <div className="p-4">
              <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase mb-2">
                Skill: {clue.skill}
              </p>
              <button
                onClick={() => toggleReveal(i)}
                className={`w-full text-left border-2 px-3 py-2 font-mono text-sm transition-all ${
                  revealed[i]
                    ? `${colorMap[i].split(" ")[0]} bg-foreground/5`
                    : "border-foreground/30 text-muted-foreground"
                }`}
              >
                {revealed[i] ? (
                  <>
                    <span className="text-xs text-muted-foreground block mb-1">Answer:</span>
                    <span className="font-bold">{state.panelAnswers[i] || "(no answer)"}</span>
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
      <div className="comic-panel-cyan bg-card max-w-2xl w-full p-4 mb-6">
        <p className="text-accent text-xs font-mono font-bold tracking-widest uppercase mb-3">
          ▶ Connect the Timeline:
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            `1. ${state.detectives[0]?.name || "Det. 1"}'s Date`,
            `2. ${state.detectives[1]?.name || "Det. 2"}'s 'They'`,
            `3. ${state.detectives[2]?.name || "Det. 3"}'s Topic`,
            `4. ${state.detectives[3]?.name || "Det. 4"}'s Tone`,
          ].map((item, i) => (
            <span key={i} className="bg-foreground/10 border border-foreground/20 px-2 py-1 text-xs font-mono text-muted-foreground">
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Final verdict */}
      <div className="comic-panel bg-card max-w-2xl w-full p-6">
        <h3 className="text-primary text-xl font-black tracking-widest mb-1 uppercase">
          Final Case Report
        </h3>
        <p className="text-muted-foreground font-mono text-xs mb-4">
          What was the primary cause of Maya's situation?
        </p>
        <textarea
          className="comic-input resize-none mb-4"
          style={{ minHeight: "80px" }}
          placeholder="Squad consensus: e.g. Cyberbullying via the Whisper app escalated over two weeks, leading to..."
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          maxLength={300}
        />
        {error && (
          <p className="text-destructive font-mono text-sm mb-3">✗ {error}</p>
        )}
        <button
          onClick={handleSubmit}
          className="comic-panel w-full bg-primary text-primary-foreground py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
          style={{ boxShadow: "5px 5px 0px hsl(45 100% 30%)" }}
        >
          SUBMIT CASE REPORT →
        </button>
      </div>
    </div>
  );
}
