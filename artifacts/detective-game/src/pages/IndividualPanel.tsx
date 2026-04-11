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
    if (e.key === "Enter" && submitted && correct) nextPanel();
  };

  const panelNum = state.currentPanel + 1;

  // Colors per panel: red, blue, yellow, red
  const accentColors = [
    "hsl(354 78% 44%)",
    "hsl(210 80% 40%)",
    "hsl(48 100% 45%)",
    "hsl(354 78% 44%)",
  ];
  const accentDark = [
    "hsl(354 78% 28%)",
    "hsl(210 80% 25%)",
    "hsl(48 85% 30%)",
    "hsl(354 78% 28%)",
  ];
  const accentText = ["white", "white", "hsl(0 0% 10%)", "white"];
  const color = accentColors[state.currentPanel];
  const colorDark = accentDark[state.currentPanel];
  const textColor = accentText[state.currentPanel];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 relative">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Progress indicator */}
      <div className="flex items-center gap-3 mb-5 mt-5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`progress-dot ${i < state.currentPanel ? "complete" : i === state.currentPanel ? "active" : ""}`} />
            {i < 3 && (
              <div className={`h-1 w-10 border-t-2 border-dashed ${i < state.currentPanel ? "border-foreground" : "border-foreground/20"}`} />
            )}
          </div>
        ))}
      </div>

      {/* SFX + panel label */}
      <div className="flex items-center gap-4 mb-3">
        <div className="sfx-burst text-base font-black px-4 py-1" style={{ background: clue.sfxColor, color: clue.sfxTextColor }}>
          {clue.sfx}
        </div>
        <span className="text-muted-foreground font-mono text-xs tracking-widest">
          PANEL {panelNum} OF 4
        </span>
      </div>

      {/* Main panel */}
      <div className={`${clue.panelColor} bg-card max-w-xl w-full overflow-hidden`}>
        {/* Panel header */}
        <div className="border-b-4 border-foreground px-5 py-3 flex items-center justify-between" style={{ background: color }}>
          <div>
            <span className="text-xl font-black uppercase tracking-wide" style={{ color: textColor }}>
              {clue.icon} {clue.loc}
            </span>
            <span className="font-mono text-xs ml-2 opacity-80" style={{ color: textColor }}>— {clue.locLabel}</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-widest opacity-70" style={{ color: textColor }}>ASSIGNED TO</p>
            <p className="font-black text-sm tracking-widest uppercase" style={{ color: textColor }}>
              {detective?.name || `Detective ${panelNum}`}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-4">
          {/* Skill badge */}
          <div className="inline-flex items-center gap-2 border-2 border-foreground/30 bg-muted px-3 py-1">
            <span className="text-xs font-mono font-bold text-muted-foreground tracking-widest uppercase">SKILL:</span>
            <span className="text-xs font-mono font-black text-foreground tracking-widest uppercase">{clue.skill}</span>
          </div>

          {/* Evidence text */}
          <div className="bg-muted border-2 border-foreground/20 p-4 font-mono text-sm leading-loose">
            <p className="text-xs tracking-widest mb-2 font-black text-muted-foreground uppercase">▶ Evidence Found:</p>
            {clue.text.split("\n").map((line, i) => (
              <p key={i} className="text-foreground mb-1">{line}</p>
            ))}
          </div>

          {/* Question bubble */}
          <div className="speech-bubble">
            <p className="font-mono text-sm font-bold leading-relaxed text-foreground">
              ❓ {clue.q}
            </p>
          </div>
          <div className="pt-5" />

          {/* Hint */}
          {showHint && !correct && (
            <div className="slide-up border-2 border-foreground/30 bg-muted p-3">
              <p className="text-xs font-mono font-black tracking-widest uppercase mb-1" style={{ color }}>
                💡 Hint:
              </p>
              <p className="text-muted-foreground text-xs font-mono">
                Think about: <span className="italic font-bold">"{clue.ans}"</span> — re-read the evidence carefully!
              </p>
            </div>
          )}

          {/* Answer input */}
          {!submitted && (
            <div className={shake ? "shake" : ""}>
              <label className="block text-xs font-mono font-black text-muted-foreground tracking-widest uppercase mb-2">
                Your Answer:
              </label>
              <div className="flex gap-2">
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
                  className="comic-panel font-black tracking-widest uppercase text-sm px-5 py-2 hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 whitespace-nowrap"
                  style={{ background: color, color: textColor, boxShadow: `3px 3px 0 ${colorDark}` }}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          )}

          {/* Correct result */}
          {submitted && correct && (
            <div className="relative">
              <div className="slide-up border-2 p-4 text-center" style={{ borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)" }}>
                <p className="text-xl font-black tracking-widest mb-1" style={{ color: "hsl(210 80% 40%)" }}>
                  ✓ CLUE CAPTURED!
                </p>
                <p className="text-muted-foreground font-mono text-sm mb-1">
                  Recorded: <span className="font-bold text-foreground">"{answer}"</span>
                </p>
                <p className="text-muted-foreground font-mono text-xs">
                  Do not show others. Lock this panel.
                </p>
              </div>
              {stampIn && (
                <div className="absolute top-2 right-3 stamp-in">
                  <div className="text-2xl font-black border-4 px-2 py-0.5 rotate-[-15deg]"
                    style={{ color: "hsl(210 80% 40%)", borderColor: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>
                    SOLVED
                  </div>
                </div>
              )}
              <button
                onClick={nextPanel}
                className="comic-panel w-full mt-4 text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "4px 4px 0 hsl(354 78% 28%)" }}
              >
                {state.currentPanel < 3 ? "LOCK THIS PANEL →" : "ASSEMBLE DETECTIVES →"}
              </button>
            </div>
          )}

          {/* Wrong result */}
          {submitted && !correct && (
            <div className={`slide-up border-2 border-destructive p-4 ${shake ? "shake" : ""}`} style={{ background: "hsl(354 78% 97%)" }}>
              <p className="text-xl font-black tracking-widest mb-2" style={{ color: "hsl(354 78% 44%)" }}>
                ✗ INCORRECT — TRY AGAIN
              </p>
              <button
                onClick={() => { setSubmitted(false); setShake(false); setAnswer(""); setTimeout(() => inputRef.current?.focus(), 50); }}
                className="comic-panel text-white px-5 py-2 font-black tracking-widest uppercase text-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "3px 3px 0 hsl(354 78% 28%)" }}
              >
                RETRY
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-muted-foreground font-mono text-xs text-center tracking-widest">
        PASS THE DEVICE TO DETECTIVE {panelNum}
      </p>
    </div>
  );
}
