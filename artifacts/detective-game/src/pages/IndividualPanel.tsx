import { useState, useEffect, useRef, useCallback } from "react";
import { useGame } from "@/game/GameContext";
import { CLUES } from "@/game/types";

const PANEL_MINUTES = 10;
const TOTAL_SECONDS = PANEL_MINUTES * 60;

export default function IndividualPanel() {
  const { state, submitPanel } = useGame();
  const clue = CLUES[state.panelIndex];

  const idx = state.panelIndex;
  const accentColor = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 50%)", "hsl(354 78% 44%)"][idx];
  const accentDark = ["hsl(354 78% 28%)", "hsl(210 80% 25%)", "hsl(48 85% 28%)", "hsl(354 78% 28%)"][idx];
  const accentBg = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"][idx];
  const accentText = ["white", "white", "hsl(0 0% 10%)", "white"][idx];

  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS);
  const [timerExpired, setTimerExpired] = useState(false);

  const [passedCount, setPassedCount] = useState(0);
  const [localAnswer, setLocalAnswer] = useState<"A" | "B" | "C" | "D" | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [justWrong, setJustWrong] = useState(false);
  const [neverWrong, setNeverWrong] = useState(true);
  const [hasBadge, setHasBadge] = useState(false);
  const [proceeding, setProceeding] = useState(false);
  const [showTip, setShowTip] = useState(true);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopSpeech = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsReading(false);
    setIsPaused(false);
  }, []);

  const handleListen = useCallback(() => {
    if (isReading && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      return;
    }
    if (isReading && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(clue.text.replace(/\n\n/g, ". "));
    utt.rate = 0.92;
    utt.pitch = 1.05;
    utt.lang = "en-US";
    utt.onstart = () => { setIsReading(true); setIsPaused(false); };
    utt.onend = () => { setIsReading(false); setIsPaused(false); };
    utt.onerror = () => { setIsReading(false); setIsPaused(false); };
    utteranceRef.current = utt;
    window.speechSynthesis.speak(utt);
  }, [clue.text, isReading, isPaused]);

  useEffect(() => () => { window.speechSynthesis.cancel(); }, []);

  const allDone = passedCount === clue.questions.length;
  const canProceed = allDone || timerExpired;
  const currentQ = clue.questions[passedCount];

  const diaryImages = [
    "/diary-panel-1.png",
    "/diary-panel-2.png",
    "/diary-panel-3.png",
    "/diary-panel-4.png",
  ];

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
    if (!localAnswer || !currentQ) return;
    if (localAnswer === currentQ.ans) {
      const newPassed = passedCount + 1;
      setPassedCount(newPassed);
      setLocalAnswer(null);
      setShowHint(false);
      setJustWrong(false);
      if (newPassed === clue.questions.length && neverWrong) setHasBadge(true);
    } else {
      setShowHint(true);
      setJustWrong(true);
      setNeverWrong(false);
    }
  };

  const handleRestart = () => {
    setPassedCount(0);
    setLocalAnswer(null);
    setShowHint(false);
    setJustWrong(false);
  };

  const handleLock = async () => {
    setProceeding(true);
    await submitPanel(passedCount, hasBadge);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor = timerExpired ? "hsl(0 0% 50%)" : timeLeft < 120 ? "hsl(354 78% 44%)" : timeLeft < 300 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)";
  const timerBg = timerExpired ? "hsl(0 0% 90%)" : timeLeft < 120 ? "hsl(354 78% 96%)" : timeLeft < 300 ? "hsl(48 100% 92%)" : "hsl(210 80% 95%)";

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-5 px-4">

      {/* Main Idea Tip Modal */}
      {showTip && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.75)" }}>
          <div className="comic-panel bg-card max-w-sm w-full overflow-hidden" style={{ border: "4px solid hsl(0 0% 10%)" }}>
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
                  ⚠️ Get a question wrong and you restart from Question 1!
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

      {/* Sticky HUD: timer */}
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
          {/* Diary illustration */}
          <div className="border-2 border-foreground/20 overflow-hidden" style={{ aspectRatio: "4/3", maxHeight: "220px" }}>
            <img
              src={diaryImages[idx]}
              alt={`Illustration for ${clue.date}: ${clue.loc}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Audio controls */}
          <div className="flex items-center gap-2 border-2 border-foreground/15 px-3 py-2" style={{ background: "hsl(0 0% 97%)" }}>
            <span className="font-mono text-xs font-black tracking-widest uppercase text-muted-foreground shrink-0">🎧 LISTEN:</span>
            <button
              onClick={handleListen}
              className="flex items-center gap-1.5 px-3 py-1 border-2 font-mono text-xs font-black tracking-widest uppercase transition-all hover:translate-x-0.5 active:scale-95"
              style={
                isReading && !isPaused
                  ? { borderColor: accentColor, background: accentBg, color: accentColor }
                  : { borderColor: "hsl(0 0% 60%)", background: "white", color: "hsl(0 0% 30%)" }
              }
            >
              {!isReading && <><span>▶</span><span>PLAY DIARY</span></>}
              {isReading && !isPaused && <><span className="animate-pulse">⏸</span><span>PAUSE</span></>}
              {isReading && isPaused && <><span>▶</span><span>RESUME</span></>}
            </button>
            {isReading && (
              <button
                onClick={stopSpeech}
                className="flex items-center gap-1.5 px-3 py-1 border-2 font-mono text-xs font-black tracking-widest uppercase transition-all hover:translate-x-0.5 active:scale-95"
                style={{ borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", color: "hsl(354 78% 44%)" }}
              >
                <span>⏹</span><span>STOP</span>
              </button>
            )}
            {!isReading && (
              <span className="font-mono text-xs text-muted-foreground italic">Press play to hear the diary read aloud.</span>
            )}
            {isReading && !isPaused && (
              <span className="font-mono text-xs italic" style={{ color: accentColor }}>Reading diary aloud…</span>
            )}
            {isReading && isPaused && (
              <span className="font-mono text-xs text-muted-foreground italic">Paused.</span>
            )}
          </div>

          {/* Diary entry */}
          <div className="bg-muted border-2 border-foreground/15 p-4 max-h-56 overflow-y-auto">
            <p className="text-xs tracking-widest font-black text-muted-foreground uppercase mb-3">📖 Diary Entry — Read carefully:</p>
            {clue.text.split("\n\n").map((para, i) => (
              <p key={i} className="text-sm leading-relaxed text-foreground mb-3 font-mono">{para}</p>
            ))}
          </div>

          {/* Progress dots */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs font-black tracking-widest uppercase" style={{ color: accentColor }}>
                Progress
              </p>
              <span className="font-mono text-xs text-muted-foreground">{passedCount}/5 correct</span>
            </div>
            <div className="flex gap-2">
              {clue.questions.map((_, i) => (
                <div
                  key={i}
                  className="flex-1 h-3 border-2 transition-all duration-300"
                  style={{
                    borderColor: i < passedCount ? "hsl(210 80% 40%)" : i === passedCount ? accentColor : "hsl(0 0% 75%)",
                    background: i < passedCount ? "hsl(210 80% 40%)" : i === passedCount ? accentBg : "white",
                  }}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-0.5">
              {clue.questions.map((_, i) => (
                <div key={i} className="flex-1 text-center font-mono text-xs" style={{ color: i < passedCount ? "hsl(210 80% 40%)" : i === passedCount ? accentColor : "hsl(0 0% 70%)" }}>
                  {i < passedCount ? "✓" : i === passedCount ? "▶" : "○"}
                </div>
              ))}
            </div>
          </div>

          {/* ── All done ── */}
          {allDone && (
            <div className="space-y-4">
              {hasBadge ? (
                <div className="slide-up border-4 border-foreground p-4 text-center" style={{ background: "hsl(48 100% 50%)" }}>
                  <p className="text-3xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 10%)" }}>
                    🏆 DETECTIVE BADGE EARNED!
                  </p>
                  <p className="font-mono text-sm mt-1">You got 5/5 correct with no wrong answers — outstanding!</p>
                </div>
              ) : (
                <div className="slide-up border-4 border-foreground p-4 text-center" style={{ background: "hsl(210 80% 95%)" }}>
                  <p className="text-2xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(210 80% 40%)" }}>
                    ✓ ALL 5 CORRECT!
                  </p>
                  <p className="font-mono text-sm mt-1 text-muted-foreground">Good work — you can now lock your panel.</p>
                </div>
              )}
              <button
                onClick={handleLock}
                disabled={proceeding}
                className="comic-panel w-full py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-60 slide-up"
                style={{
                  background: hasBadge ? "hsl(48 100% 50%)" : "hsl(210 80% 40%)",
                  color: hasBadge ? "hsl(0 0% 10%)" : "white",
                  boxShadow: hasBadge ? "4px 4px 0 hsl(48 85% 28%)" : "4px 4px 0 hsl(210 80% 25%)",
                }}
              >
                {proceeding ? "LOCKING..." : hasBadge ? "🏆 BADGE EARNED — LOCK PANEL →" : "LOCK PANEL →"}
              </button>
            </div>
          )}

          {/* ── Timer expired mid-game ── */}
          {timerExpired && !allDone && (
            <div className="space-y-3">
              <div className="slide-up border-4 p-3 text-center" style={{ borderColor: "hsl(0 0% 60%)", background: "hsl(0 0% 95%)" }}>
                <p className="font-black text-lg" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 40%)" }}>
                  ⏱ TIME'S UP — You may proceed without the badge.
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">Score: {passedCount}/5 correct</p>
              </div>
              <button
                onClick={handleLock}
                disabled={proceeding}
                className="comic-panel w-full py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-60"
                style={{ background: "hsl(0 0% 45%)", color: "white", boxShadow: "4px 4px 0 hsl(0 0% 25%)" }}
              >
                {proceeding ? "LOCKING..." : "LOCK PANEL (NO BADGE) →"}
              </button>
            </div>
          )}

          {/* ── Active question ── */}
          {!allDone && !timerExpired && currentQ && (
            <div className="space-y-4">
              {/* Question number badge */}
              <div className="flex items-center gap-3">
                <div
                  className="shrink-0 w-9 h-9 border-4 border-foreground flex items-center justify-center font-black text-lg"
                  style={{ fontFamily: "'Bangers', cursive", background: accentColor, color: accentText }}
                >
                  {passedCount + 1}
                </div>
                <p className="font-mono text-sm font-bold text-foreground leading-snug">{currentQ.q}</p>
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2 pl-0">
                {currentQ.options.map((opt) => {
                  const isSelected = localAnswer === opt.key;
                  const isWrong = justWrong && isSelected;
                  return (
                    <button
                      key={opt.key}
                      disabled={justWrong}
                      onClick={() => { if (!justWrong) setLocalAnswer(opt.key); }}
                      className="border-2 px-4 py-2.5 font-mono text-sm flex items-center gap-3 transition-all duration-100 w-full text-left hover:translate-x-0.5 disabled:cursor-default"
                      style={
                        isWrong
                          ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", color: "hsl(0 0% 10%)" }
                          : isSelected
                          ? { borderColor: accentColor, background: accentBg, color: "hsl(0 0% 10%)" }
                          : { borderColor: "hsl(0 0% 75%)", background: "white", color: "hsl(0 0% 25%)" }
                      }
                    >
                      <span className="w-4 shrink-0">
                        {isWrong
                          ? <span style={{ color: "hsl(354 78% 44%)" }}>✗</span>
                          : isSelected
                          ? <span style={{ color: accentColor }}>◉</span>
                          : <span style={{ color: "hsl(0 0% 60%)" }}>○</span>}
                      </span>
                      <span className="font-black shrink-0" style={{ color: isSelected ? accentColor : "hsl(0 0% 45%)" }}>
                        {opt.key})
                      </span>
                      <span className="font-mono text-sm">{opt.text}</span>
                    </button>
                  );
                })}
              </div>

              {/* Hint (shown on wrong) */}
              {showHint && (
                <div className="slide-up border-l-4 pl-3 py-2 font-mono text-sm leading-relaxed" style={{ borderColor: "hsl(48 100% 40%)", background: "hsl(48 100% 92%)" }}>
                  <span className="font-black" style={{ color: "hsl(48 85% 28%)" }}>💡 HINT: </span>
                  <span className="text-foreground/80">{currentQ.hint}</span>
                </div>
              )}

              {/* Wrong answer — restart prompt */}
              {justWrong && (
                <div className="slide-up space-y-3">
                  <div className="border-4 p-3 text-center" style={{ borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)" }}>
                    <p className="font-black text-base tracking-wide" style={{ fontFamily: "'Bangers', cursive", color: "hsl(354 78% 44%)", fontSize: "1.25rem" }}>
                      ✗ WRONG ANSWER — READ THE HINT AND TRY AGAIN
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-1">You must restart from Question 1.</p>
                  </div>
                  <button
                    onClick={handleRestart}
                    className="comic-panel w-full py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                    style={{ background: "hsl(354 78% 44%)", color: "white", boxShadow: "4px 4px 0 hsl(354 78% 28%)" }}
                  >
                    ↩ RESTART FROM QUESTION 1
                  </button>
                </div>
              )}

              {/* Check button (only when answer selected and not yet wrong) */}
              {!justWrong && (
                <button
                  onClick={handleCheck}
                  disabled={!localAnswer}
                  className="comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: accentColor, boxShadow: `4px 4px 0 ${accentDark}` }}
                >
                  {localAnswer ? "CHECK ANSWER →" : "SELECT AN ANSWER ABOVE"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <p className="mt-3 text-muted-foreground font-mono text-xs text-center tracking-widest">
        {state.icon} {state.codeName.toUpperCase()} · {state.studentName}
      </p>
    </div>
  );
}
