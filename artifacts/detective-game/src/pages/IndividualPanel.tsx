import { useState, useEffect } from "react";
import { useGame } from "@/game/GameContext";
import { CLUES } from "@/game/types";

const PANEL_MINUTES = 10;
const TOTAL_SECONDS = PANEL_MINUTES * 60;

export default function IndividualPanel() {
  const { state, selectAnswer, submitPanel } = useGame();
  const clue = CLUES[state.panelIndex];
  const selections = state.panelSelections;

  const idx = state.panelIndex;
  const accentColor = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 50%)", "hsl(354 78% 44%)"][idx];
  const accentDark = ["hsl(354 78% 28%)", "hsl(210 80% 25%)", "hsl(48 85% 28%)", "hsl(354 78% 28%)"][idx];
  const accentBg = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"][idx];
  const accentText = ["white", "white", "hsl(0 0% 10%)", "white"][idx];

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);
  const [attemptsMade, setAttemptsMade] = useState(0);
  const [lockedCorrect, setLockedCorrect] = useState<boolean[]>(clue.questions.map(() => false));
  const [showHint, setShowHint] = useState<boolean[]>(clue.questions.map(() => false));
  const [hasBadge, setHasBadge] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [showTip, setShowTip] = useState(true);

  const allCorrect = lockedCorrect.every(Boolean);
  const canProceed = allCorrect || timerExpired;
  const canCheck = clue.questions.every((_, i) => lockedCorrect[i] || selections[i] !== null);

  useEffect(() => {
    if (timerExpired) return;
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { setTimerExpired(true); clearInterval(interval); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerExpired]);

  const handleCheck = () => {
    const newLocked = lockedCorrect.map((was, i) => was || selections[i] === clue.questions[i].ans);
    const newHint = clue.questions.map((q, i) => {
      if (newLocked[i]) return false;
      return selections[i] !== null && selections[i] !== q.ans;
    });
    setLockedCorrect(newLocked);
    setShowHint(newHint);
    setAttemptsMade((a) => a + 1);
    if (newLocked.every(Boolean) && !timerExpired) setHasBadge(true);
  };

  const handleLock = async () => {
    setProceeding(true);
    const score = lockedCorrect.filter(Boolean).length;
    await submitPanel(score, hasBadge);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor = timerExpired ? "hsl(0 0% 50%)" : timeLeft < 120 ? "hsl(354 78% 44%)" : timeLeft < 300 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)";
  const timerBg = timerExpired ? "hsl(0 0% 90%)" : timeLeft < 120 ? "hsl(354 78% 96%)" : timeLeft < 300 ? "hsl(48 100% 92%)" : "hsl(210 80% 95%)";

  const optionState = (qIdx: number, key: "A" | "B" | "C") => {
    const locked = lockedCorrect[qIdx];
    const selected = selections[qIdx] === key;
    const correct = clue.questions[qIdx].ans === key;
    const attempted = attemptsMade > 0;
    if (locked) return correct ? "locked-correct" : "locked-unchosen";
    if (attempted && selected && !correct) return "wrong";
    if (attempted && correct && selected) return "correct";
    if (selected) return "selected";
    return "idle";
  };

  const optionStyle = (s: string): { cls: string; style: React.CSSProperties } => {
    const base = "border-2 px-4 py-2.5 font-mono text-sm flex items-center gap-3 transition-all duration-100 w-full text-left";
    switch (s) {
      case "locked-correct": return { cls: base, style: { borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)", color: "hsl(0 0% 10%)" } };
      case "wrong":          return { cls: `${base} cursor-pointer hover:translate-x-0.5`, style: { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", color: "hsl(0 0% 10%)" } };
      case "selected":       return { cls: `${base} cursor-pointer hover:translate-x-0.5`, style: { borderColor: accentColor, background: accentBg, color: "hsl(0 0% 10%)" } };
      case "idle":           return { cls: `${base} cursor-pointer hover:translate-x-0.5`, style: { borderColor: "hsl(0 0% 75%)", background: "white", color: "hsl(0 0% 25%)" } };
      default:               return { cls: base, style: { borderColor: "hsl(0 0% 85%)", background: "hsl(0 0% 97%)", color: "hsl(0 0% 55%)" } };
    }
  };

  const optionIcon = (s: string) => {
    switch (s) {
      case "locked-correct": return <span style={{ color: "hsl(210 80% 40%)" }}>✓</span>;
      case "wrong":          return <span style={{ color: "hsl(354 78% 44%)" }}>✗</span>;
      case "selected":       return <span style={{ color: accentColor }}>◉</span>;
      default:               return <span style={{ color: "hsl(0 0% 60%)" }}>○</span>;
    }
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-5 px-4">
      {/* Main Idea Tip Modal */}
      {showTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="comic-panel bg-card max-w-sm w-full overflow-hidden" style={{ border: "4px solid hsl(0 0% 10%)" }}>
            {/* Header */}
            <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(354 78% 44%)" }}>
              <p className="font-mono text-xs text-white/75 uppercase tracking-widest">Detective Strategy</p>
              <h2 className="text-3xl font-black text-white tracking-widest leading-none" style={{ fontFamily: "'Bangers', cursive" }}>
                🔍 FIND THE MAIN IDEA
              </h2>
            </div>

            <div className="p-5 space-y-4">
              <p className="font-mono text-sm leading-relaxed text-foreground">
                Before answering, read Maya's diary entry once all the way through. Then ask yourself:
              </p>

              <div className="space-y-2">
                {[
                  { icon: "❓", tip: "What is this mostly about?", sub: "One sentence that covers the whole entry, not just one detail." },
                  { icon: "📌", tip: "What keeps coming back?", sub: "Repeated words, feelings, or events are clues to the main idea." },
                  { icon: "🚫", tip: "Ignore small details first.", sub: "Dates, names, and single events support the main idea — they are not it." },
                ].map(({ icon, tip, sub }) => (
                  <div key={tip} className="flex gap-3 items-start border-2 border-foreground/10 bg-muted px-3 py-2">
                    <span className="text-lg shrink-0 mt-0.5">{icon}</span>
                    <div>
                      <p className="font-black text-sm text-foreground">{tip}</p>
                      <p className="font-mono text-xs italic text-muted-foreground">{sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-4 border-foreground px-4 py-2 text-center" style={{ background: "hsl(48 100% 50%)" }}>
                <p className="font-mono text-xs font-black tracking-widest uppercase" style={{ color: "hsl(0 0% 10%)" }}>
                  💡 The questions test whether you found the main idea — not just random facts.
                </p>
              </div>

              <button
                onClick={() => setShowTip(false)}
                className="comic-panel w-full py-3 text-lg font-black tracking-widest uppercase text-white hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "4px 4px 0 hsl(354 78% 28%)" }}
              >
                GOT IT — START INVESTIGATING →
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Sticky HUD: timer + badge */}
      <div className="sticky top-4 z-40 w-full max-w-2xl mb-4">
        <div className="comic-panel bg-card flex items-center justify-between px-4 py-2 gap-4">
          <div className="flex items-center gap-2">
            <span style={{ color: timerColor }}>⏱</span>
            <div
              className="font-mono text-2xl font-black tracking-widest px-3 py-0.5 border-2"
              style={{ color: timerColor, background: timerBg, borderColor: timerColor, fontFamily: "'Bangers', cursive", minWidth: "80px", textAlign: "center" }}
            >
              {timerExpired ? "TIME UP" : `${minutes}:${seconds}`}
            </div>
            <span className="font-mono text-xs text-muted-foreground tracking-widest hidden sm:block">
              {timerExpired ? "You may lock your panel" : "remaining"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-muted-foreground text-right hidden sm:block">
              <span>{lockedCorrect.filter(Boolean).length}/5 correct</span>
            </div>
            {hasBadge && (
              <div className="sfx-burst text-xs font-black px-3 py-1 animate-pulse" style={{ background: "hsl(48 100% 50%)", color: "hsl(0 0% 10%)" }}>
                🏆 BADGE!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Panel card */}
      <div className={`${clue.panelColor} bg-card max-w-2xl w-full overflow-hidden`}>
        {/* Panel header */}
        <div className="border-b-4 border-foreground px-5 py-3 flex items-center justify-between" style={{ background: accentColor }}>
          <div>
            <span className="text-xl font-black uppercase tracking-wide" style={{ color: accentText }}>
              {clue.icon} {clue.date}: {clue.loc}
            </span>
            <span className="block text-xs font-mono opacity-80 mt-0.5" style={{ color: accentText }}>Domain: {clue.domain}</span>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-widest opacity-70" style={{ color: accentText }}>DETECTIVE</p>
            <p className="font-black text-sm tracking-widest uppercase" style={{ color: accentText }}>{state.studentName}</p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Diary entry — bigger text */}
          <div className="bg-muted border-2 border-foreground/15 p-4 max-h-64 overflow-y-auto">
            <p className="text-xs tracking-widest font-black text-muted-foreground uppercase mb-3">📖 Diary Entry — Read carefully:</p>
            {clue.text.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground mb-3 font-mono">{para}</p>
            ))}
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between font-mono text-xs text-muted-foreground mb-1">
              <span>{lockedCorrect.filter(Boolean).length}/5 correct</span>
              <span>{attemptsMade > 0 ? `${attemptsMade} attempt${attemptsMade !== 1 ? "s" : ""}` : "Not checked yet"}</span>
            </div>
            <div className="h-2 border-2 border-foreground/20 bg-muted overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${(lockedCorrect.filter(Boolean).length / 5) * 100}%`,
                  background: allCorrect ? "hsl(210 80% 40%)" : accentColor,
                }}
              />
            </div>
          </div>

          {/* Questions */}
          <div>
            <p className="text-xs font-mono font-black tracking-widest uppercase mb-3" style={{ color: accentColor }}>
              ▶ Answer All 5 Questions:
            </p>
            <div className="space-y-5">
              {clue.questions.map((q, qIdx) => {
                const locked = lockedCorrect[qIdx];
                const attempted = attemptsMade > 0;
                const isWrong = attempted && !locked && selections[qIdx] !== null && selections[qIdx] !== q.ans;

                return (
                  <div key={qIdx} className={`space-y-2 transition-all duration-300 ${locked ? "opacity-80" : ""}`}>
                    <p className="font-mono text-sm font-bold text-foreground">
                      <span className="font-black" style={{ color: locked ? "hsl(210 80% 40%)" : isWrong ? "hsl(354 78% 44%)" : accentColor }}>
                        {qIdx + 1}.
                      </span>{" "}
                      {q.q}
                      {locked && <span className="ml-2 font-mono text-xs" style={{ color: "hsl(210 80% 40%)" }}>✓ CORRECT</span>}
                      {isWrong && <span className="ml-2 font-mono text-xs" style={{ color: "hsl(354 78% 44%)" }}>✗ TRY AGAIN</span>}
                    </p>

                    <div className="grid grid-cols-1 gap-1.5 pl-4">
                      {q.options.map((opt) => {
                        const s = optionState(qIdx, opt.key);
                        const { cls, style } = optionStyle(s);
                        const isLocked = s === "locked-correct" || s === "locked-unchosen";
                        return (
                          <button
                            key={opt.key}
                            className={cls}
                            style={style}
                            disabled={isLocked}
                            onClick={() => { if (!isLocked) selectAnswer(qIdx, opt.key); }}
                          >
                            <span className="w-4 shrink-0">{optionIcon(s)}</span>
                            <span className="font-black shrink-0" style={{ color: s === "locked-correct" ? "hsl(210 80% 40%)" : s === "selected" ? accentColor : "hsl(0 0% 45%)" }}>
                              {opt.key})
                            </span>
                            <span className="font-mono text-sm">{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Hint */}
                    {showHint[qIdx] && (
                      <div className="slide-up ml-4 border-l-4 pl-3 py-2 font-mono text-sm leading-relaxed" style={{ borderColor: "hsl(48 100% 40%)", background: "hsl(48 100% 92%)" }}>
                        <span className="font-black" style={{ color: "hsl(48 85% 28%)" }}>💡 HINT: </span>
                        <span className="text-foreground/80">{q.hint}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Badge earned banner */}
          {hasBadge && (
            <div className="slide-up border-4 border-foreground p-4 text-center" style={{ background: "hsl(48 100% 50%)" }}>
              <p className="text-3xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 10%)" }}>
                🏆 DETECTIVE BADGE EARNED!
              </p>
              <p className="font-mono text-sm mt-1">You got 5/5 correct — excellent detective work!</p>
            </div>
          )}

          {/* Timer expired */}
          {timerExpired && !allCorrect && (
            <div className="slide-up border-4 p-3 text-center" style={{ borderColor: "hsl(0 0% 60%)", background: "hsl(0 0% 95%)" }}>
              <p className="font-black text-lg" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 40%)" }}>
                ⏱ TIME'S UP — You may proceed without the badge.
              </p>
              <p className="font-mono text-xs text-muted-foreground mt-0.5">Score: {lockedCorrect.filter(Boolean).length}/5 correct</p>
            </div>
          )}

          {/* Fix errors message */}
          {attemptsMade > 0 && !allCorrect && !timerExpired && (
            <div className="border-2 p-3 text-center" style={{ borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)" }}>
              <p className="font-mono text-sm font-black" style={{ color: "hsl(354 78% 44%)" }}>
                ✗ Fix highlighted questions to earn your badge and proceed.
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="space-y-2">
            {!allCorrect && !timerExpired && (
              <button
                onClick={handleCheck}
                disabled={!canCheck}
                className="comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-50"
                style={{ background: accentColor, boxShadow: `4px 4px 0 ${accentDark}` }}
              >
                {attemptsMade === 0
                  ? `CHECK ANSWERS (${selections.filter(Boolean).length}/5 answered)`
                  : `RECHECK WRONG ANSWERS (${5 - lockedCorrect.filter(Boolean).length} remaining)`}
              </button>
            )}

            {canProceed && (
              <button
                onClick={handleLock}
                disabled={proceeding}
                className="comic-panel w-full py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-60 slide-up"
                style={{
                  background: hasBadge ? "hsl(48 100% 50%)" : "hsl(0 0% 45%)",
                  color: hasBadge ? "hsl(0 0% 10%)" : "white",
                  boxShadow: hasBadge ? "4px 4px 0 hsl(48 85% 28%)" : "4px 4px 0 hsl(0 0% 25%)",
                }}
              >
                {proceeding ? "LOCKING..." : hasBadge ? "🏆 BADGE EARNED — LOCK PANEL →" : "LOCK PANEL (NO BADGE) →"}
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="mt-3 text-muted-foreground font-mono text-xs text-center tracking-widest">
        {state.icon} {state.codeName.toUpperCase()} · {state.studentName}
      </p>
    </div>
  );
}
