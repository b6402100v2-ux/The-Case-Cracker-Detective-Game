import { useState } from "react";
import { useGame } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function IndividualPanel() {
  const { state, selectAnswer, submitPanel } = useGame();
  const clue = CLUES[state.panelIndex];
  const selections = state.panelSelections;

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [stampIn, setStampIn] = useState(false);
  const [loading, setLoading] = useState(false);

  const accentColors = [
    "hsl(354 78% 44%)",
    "hsl(210 80% 40%)",
    "hsl(48 100% 50%)",
    "hsl(354 78% 44%)",
  ];
  const accentDark = [
    "hsl(354 78% 28%)",
    "hsl(210 80% 25%)",
    "hsl(48 85% 28%)",
    "hsl(354 78% 28%)",
  ];
  const accentBg = [
    "hsl(354 78% 96%)",
    "hsl(210 80% 95%)",
    "hsl(48 100% 92%)",
    "hsl(354 78% 96%)",
  ];
  const accentTextLight = ["white", "white", "hsl(0 0% 10%)", "white"];

  const idx = state.panelIndex;
  const color = accentColors[idx];
  const colorDark = accentDark[idx];
  const colorBg = accentBg[idx];
  const textColor = accentTextLight[idx];

  const score = submitted
    ? clue.questions.reduce((acc, q, i) => acc + (selections[i] === q.ans ? 1 : 0), 0)
    : 0;

  const allAnswered = selections.every((s) => s !== null);

  const handleSubmit = () => {
    if (!allAnswered) {
      setError("Answer all 5 questions before submitting!");
      return;
    }
    setError("");
    setSubmitted(true);
    setTimeout(() => setStampIn(true), 300);
  };

  const handleLock = async () => {
    setLoading(true);
    await submitPanel();
    setLoading(false);
  };

  const optionBase = (qIdx: number, key: "A" | "B" | "C") => {
    const selected = selections[qIdx] === key;
    const correct = clue.questions[qIdx].ans === key;
    if (!submitted) {
      return {
        cls: "border-2 px-4 py-2 font-mono text-sm cursor-pointer transition-all duration-100 flex items-center gap-3 hover:translate-x-0.5 select-none",
        style: selected
          ? { borderColor: color, background: colorBg, color: "hsl(0 0% 10%)" }
          : { borderColor: "hsl(0 0% 75%)", background: "white", color: "hsl(0 0% 30%)" },
      };
    }
    if (correct) return { cls: "border-2 px-4 py-2 font-mono text-sm flex items-center gap-3", style: { borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)", color: "hsl(0 0% 10%)" } };
    if (selected && !correct) return { cls: "border-2 px-4 py-2 font-mono text-sm flex items-center gap-3", style: { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", color: "hsl(0 0% 10%)" } };
    return { cls: "border-2 px-4 py-2 font-mono text-sm flex items-center gap-3", style: { borderColor: "hsl(0 0% 85%)", background: "hsl(0 0% 98%)", color: "hsl(0 0% 60%)" } };
  };

  const optionIcon = (qIdx: number, key: "A" | "B" | "C") => {
    if (!submitted) return selections[qIdx] === key ? "◉" : "○";
    const correct = clue.questions[qIdx].ans === key;
    if (correct) return "✓";
    if (selections[qIdx] === key) return "✗";
    return "○";
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-6 px-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Squad badge */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <span className="text-2xl">{state.icon}</span>
        <div>
          <p className="font-black text-sm tracking-widest uppercase" style={{ fontFamily: "'Bangers', cursive", color }}>
            {state.codeName}
          </p>
          <p className="font-mono text-xs text-muted-foreground tracking-widest">Panel {idx + 1} of 4</p>
        </div>
        <div className="sfx-burst text-sm font-black px-3 py-1 ml-auto" style={{ background: clue.sfxColor, color: clue.sfxTextColor }}>
          {clue.sfx}
        </div>
      </div>

      {/* Main panel */}
      <div className={`${clue.panelColor} bg-card max-w-2xl w-full overflow-hidden relative`}>
        {stampIn && (
          <div className="absolute top-4 right-4 z-10 stamp-in">
            <div
              className="text-2xl font-black border-4 px-3 py-1 rotate-[-12deg]"
              style={{ color: score >= 3 ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)", borderColor: score >= 3 ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}
            >
              {score}/5
            </div>
          </div>
        )}

        {/* Panel header */}
        <div className="border-b-4 border-foreground px-5 py-3 flex items-center justify-between" style={{ background: color }}>
          <div>
            <span className="text-xl font-black uppercase tracking-wide" style={{ color: textColor }}>
              {clue.icon} {clue.date}: {clue.loc}
            </span>
            <span className="block text-xs font-mono opacity-80 mt-0.5" style={{ color: textColor }}>
              Domain: {clue.domain}
            </span>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-widest opacity-70" style={{ color: textColor }}>DETECTIVE</p>
            <p className="font-black text-sm tracking-widest uppercase" style={{ color: textColor }}>
              {state.studentName}
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Diary entry */}
          <div className="bg-muted border-2 border-foreground/15 p-4 font-mono text-xs leading-relaxed max-h-52 overflow-y-auto">
            <p className="text-xs tracking-widest font-black text-muted-foreground uppercase mb-2">📖 Diary Entry:</p>
            {clue.text.split("\n\n").map((para, i) => (
              <p key={i} className="text-foreground/80 mb-2">{para}</p>
            ))}
          </div>

          {/* Questions */}
          <div>
            <p className="text-xs font-mono font-black tracking-widest uppercase mb-3" style={{ color }}>
              ▶ Answer All 5 Questions:
            </p>
            <div className="space-y-4">
              {clue.questions.map((q, qIdx) => (
                <div key={qIdx} className="space-y-2">
                  <p className="font-mono text-sm font-bold text-foreground">
                    <span className="font-black" style={{ color }}>{qIdx + 1}.</span> {q.q}
                  </p>
                  <div className="grid grid-cols-1 gap-1.5 pl-4">
                    {q.options.map((opt) => {
                      const s = optionBase(qIdx, opt.key);
                      return (
                        <button
                          key={opt.key}
                          className={s.cls}
                          style={s.style}
                          onClick={() => !submitted && selectAnswer(qIdx, opt.key)}
                          disabled={submitted}
                        >
                          <span className="font-black w-4 shrink-0" style={{ color: submitted ? undefined : (selections[qIdx] === opt.key ? color : "hsl(0 0% 60%)") }}>
                            {optionIcon(qIdx, opt.key)}
                          </span>
                          <span className="font-black mr-1" style={{ color: submitted ? undefined : (selections[qIdx] === opt.key ? color : "hsl(0 0% 50%)") }}>
                            {opt.key})
                          </span>
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {error && <p className="font-mono text-sm font-bold" style={{ color: "hsl(354 78% 44%)" }}>✗ {error}</p>}

          {submitted && (
            <div className="slide-up border-2 p-4 text-center" style={{
              borderColor: score >= 3 ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)",
              background: score >= 3 ? "hsl(210 80% 95%)" : "hsl(354 78% 96%)",
            }}>
              <p className="font-black text-xl tracking-widest" style={{ color: score >= 3 ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>
                {score >= 4 ? "EXCELLENT!" : score >= 3 ? "GOOD WORK!" : score >= 2 ? "PARTIAL CLUE" : "KEEP TRYING"}
              </p>
              <p className="font-mono text-sm text-muted-foreground mt-1">Score: <strong>{score}/5</strong></p>
              <p className="font-mono text-xs text-muted-foreground mt-1">Lock your panel to wait for your squad.</p>
            </div>
          )}

          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
              style={{ background: color, boxShadow: `4px 4px 0 ${colorDark}` }}
            >
              SUBMIT ANSWERS ({selections.filter(Boolean).length}/5 selected)
            </button>
          ) : (
            <button
              onClick={handleLock}
              disabled={loading}
              className="comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-60"
              style={{ background: "hsl(354 78% 44%)", boxShadow: "4px 4px 0 hsl(354 78% 28%)" }}
            >
              {loading ? "LOCKING..." : "LOCK & WAIT FOR SQUAD →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
