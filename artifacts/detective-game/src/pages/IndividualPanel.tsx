import { useState, useEffect, useRef } from "react";
import { useGame } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function IndividualPanel() {
  const { state, submitPanelAnswer, nextPanel } = useGame();
  const clue = CLUES[state.currentPanel];
  const detective = state.detectives[state.currentPanel];

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [shake, setShake] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [stampIn, setStampIn] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setAnswer("");
    setSubmitted(false);
    setCorrect(false);
    setShake(false);
    setShowHint(false);
    setStampIn(false);
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [state.currentPanel]);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    const isCorrect = submitPanelAnswer(answer);
    setCorrect(isCorrect);
    setSubmitted(true);
    if (isCorrect) {
      setTimeout(() => setStampIn(true), 200);
    } else {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setTimeout(() => setShowHint(true), 800);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !submitted) handleSubmit();
    if (e.key === "Enter" && submitted && correct) handleNext();
  };

  const handleNext = () => {
    nextPanel();
  };

  const panelNum = state.currentPanel + 1;
  const colorMap = ["text-secondary", "text-accent", "text-primary", "text-secondary"];
  const bgMap = ["bg-secondary/10", "bg-accent/10", "bg-primary/10", "bg-secondary/10"];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 relative">
      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-6">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`progress-dot ${i < state.currentPanel ? "complete" : i === state.currentPanel ? "active" : ""}`} />
            {i < 3 && (
              <div className={`h-0.5 w-12 ${i < state.currentPanel ? "bg-accent" : "bg-foreground/20"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Panel number header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="sfx-burst text-lg" style={{ background: clue.sfxColor, color: "hsl(45 20% 8%)" }}>
          {clue.sfx}
        </div>
        <span className="text-muted-foreground font-mono text-sm tracking-widest">
          PANEL {panelNum} OF 4
        </span>
      </div>

      {/* Main panel */}
      <div className={`${clue.panelColor} bg-card max-w-2xl w-full overflow-hidden`}>
        {/* Panel header */}
        <div className="border-b-4 border-foreground bg-foreground px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <span className={`text-xl font-black ${colorMap[state.currentPanel]} uppercase tracking-wide`}>
                {clue.icon} {clue.loc}
              </span>
              <span className="text-background/70 font-mono text-sm ml-3">— {clue.locLabel}</span>
            </div>
            <div className="text-right">
              <p className="text-background/60 font-mono text-xs tracking-widest">ASSIGNED TO</p>
              <p className="text-primary font-black text-sm tracking-widest uppercase">
                {detective?.name || `Detective ${panelNum}`}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Skill badge */}
          <div className={`inline-flex items-center gap-2 ${bgMap[state.currentPanel]} border-2 border-foreground/30 px-3 py-1`}>
            <span className="text-xs font-mono font-bold text-muted-foreground tracking-widest uppercase">
              SKILL:
            </span>
            <span className="text-xs font-mono font-bold text-foreground tracking-widest uppercase">
              {clue.skill}
            </span>
          </div>

          {/* Evidence text */}
          <div className="bg-foreground/5 border-2 border-foreground/20 p-4 font-mono text-sm leading-loose">
            <p className="text-muted-foreground text-xs tracking-widest mb-2 font-bold uppercase">
              ▶ Evidence Found:
            </p>
            {clue.text.split("\n").map((line, i) => (
              <p key={i} className="text-foreground/80 mb-1">{line}</p>
            ))}
          </div>

          {/* Question */}
          <div className="speech-bubble">
            <p className="font-mono text-sm font-bold leading-relaxed">
              ❓ {clue.q}
            </p>
          </div>
          <div className="pt-6" />

          {/* Hint */}
          {showHint && !correct && (
            <div className="slide-up bg-primary/10 border-2 border-primary/40 p-3">
              <p className="text-primary text-xs font-mono font-bold tracking-widest uppercase mb-1">
                💡 Hint:
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Try: <span className="italic">"{clue.ans}"</span> — re-read the evidence carefully!
              </p>
            </div>
          )}

          {/* Answer input */}
          {!submitted && (
            <div className={shake ? "shake" : ""}>
              <label className="block text-xs font-mono font-bold text-muted-foreground tracking-widest uppercase mb-2">
                Your Answer:
              </label>
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  className="comic-input flex-1"
                  placeholder="Type your answer..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  maxLength={60}
                />
                <button
                  onClick={handleSubmit}
                  className="comic-panel bg-primary text-primary-foreground px-6 py-2 font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 whitespace-nowrap"
                  style={{ boxShadow: "3px 3px 0px hsl(45 100% 30%)" }}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          )}

          {/* Result */}
          {submitted && correct && (
            <div className="relative">
              <div className="slide-up bg-accent/10 border-2 border-accent p-4 text-center">
                <p className="text-accent text-2xl font-black tracking-widest mb-1">
                  ✓ CLUE CAPTURED!
                </p>
                <p className="text-muted-foreground font-mono text-sm mb-1">
                  Answer recorded: <span className="text-foreground font-bold">"{answer}"</span>
                </p>
                <p className="text-muted-foreground font-mono text-xs">
                  Do not share this clue with other detectives yet.
                </p>
              </div>
              {stampIn && (
                <div className="absolute top-2 right-4 stamp-in">
                  <div
                    className="text-3xl font-black border-4 px-3 py-1 rotate-[-15deg]"
                    style={{
                      color: "hsl(195 100% 55%)",
                      borderColor: "hsl(195 100% 55%)",
                      fontFamily: "'Bangers', cursive",
                    }}
                  >
                    SOLVED
                  </div>
                </div>
              )}
              <button
                onClick={handleNext}
                className="comic-panel w-full mt-4 bg-secondary text-secondary-foreground py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
                style={{ boxShadow: "4px 4px 0px hsl(310 60% 30%)" }}
              >
                {state.currentPanel < 3 ? "LOCK THIS PANEL →" : "ASSEMBLE DETECTIVES →"}
              </button>
            </div>
          )}

          {submitted && !correct && (
            <div className={`slide-up bg-destructive/10 border-2 border-destructive p-4 ${shake ? "shake" : ""}`}>
              <p className="text-destructive text-xl font-black tracking-widest mb-2">
                ✗ INCORRECT — TRY AGAIN
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setShake(false);
                  setAnswer("");
                  setTimeout(() => inputRef.current?.focus(), 50);
                }}
                className="comic-panel bg-destructive text-destructive-foreground px-6 py-2 font-black tracking-widest uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100"
                style={{ boxShadow: "3px 3px 0px hsl(0 60% 30%)" }}
              >
                RETRY
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom note */}
      <p className="mt-4 text-muted-foreground font-mono text-xs text-center tracking-widest opacity-60">
        PASS THE DEVICE TO DETECTIVE {panelNum} — THIS IS THEIR STATION
      </p>
    </div>
  );
}
