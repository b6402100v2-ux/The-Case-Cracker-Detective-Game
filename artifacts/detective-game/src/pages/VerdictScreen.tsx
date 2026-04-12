import { useState, useEffect, useRef } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { VERDICT_OPTIONS, CORRECT_VERDICT_KEY } from "@/game/types";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

type VerdictPhase = "voting" | "waiting" | "result";

const ASSEMBLY_DURATION = 600;
const TIMER_KEY = "assemblyTimerStart";

export default function VerdictScreen() {
  const { state, fetchRoomStatus, submitVote, setPhase } = useGame();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [vPhase, setVPhase] = useState<VerdictPhase>("voting");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ASSEMBLY_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);
  const lastRoundRef = useRef<number>(1);
  const resultShownRef = useRef(false);

  useEffect(() => {
    const tick = setInterval(() => {
      const start = sessionStorage.getItem(TIMER_KEY);
      if (!start) return;
      const elapsed = Math.floor((Date.now() - parseInt(start)) / 1000);
      const remaining = Math.max(0, ASSEMBLY_DURATION - elapsed);
      setTimeLeft(remaining);
      if (remaining === 0) setTimerExpired(true);
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const poll = async () => {
      const s = await fetchRoomStatus();
      setStatus(s);
      if (!s) return;

      if (s.voteRoundNumber !== lastRoundRef.current) {
        lastRoundRef.current = s.voteRoundNumber;
        setHasVoted(false);
        setSelected(null);
        setVPhase("voting");
        resultShownRef.current = false;
      }

      if (s.allVotedThisRound && !resultShownRef.current) {
        resultShownRef.current = true;
        setVPhase("result");
      } else if (hasVoted && !s.allVotedThisRound) {
        setVPhase("waiting");
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus, hasVoted]);

  const handleVote = async () => {
    if (!selected || hasVoted) return;
    setLoading(true);
    await submitVote(selected);
    setHasVoted(true);
    setLoading(false);
    setVPhase("waiting");
  };

  const correct = status?.voteCorrect ?? false;
  const unanimous = status?.voteUnanimous ?? false;
  const agreedKey = status?.agreedKey;
  const teamBadges = status?.teamBadgesEarned ?? 0;
  const voteRound = status?.voteRoundNumber ?? 1;
  const voteComplete = status?.voteComplete ?? false;
  const votesIn = status?.roundVotesCount ?? 0;

  const resultColor = correct ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)";
  const resultBg = correct ? "hsl(210 80% 95%)" : "hsl(354 78% 96%)";

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-5 px-4">
      {TOP_BAR}

      {/* Header */}
      <div className="mt-6 mb-4 text-center">
        <div className="sfx-burst text-xl inline-block mb-2 font-black" style={{ background: "hsl(354 78% 44%)", color: "white" }}>
          VERDICT!
        </div>
        <h2 className="text-4xl font-black tracking-widest" style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive" }}>
          CASE VERDICT
        </h2>
        <div className="flex items-center justify-center gap-3 mt-1">
          <span className="text-xl">{state.icon}</span>
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{state.codeName} · Round {voteRound} of 2</p>
          <div className="flex gap-1">
            {[1, 2].map((r) => (
              <div key={r} className="border-2 text-xs font-mono px-1.5 py-0.5"
                style={voteRound === r ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", color: "hsl(354 78% 44%)" }
                  : r < voteRound ? { borderColor: "hsl(0 0% 70%)", background: "hsl(0 0% 95%)", color: "hsl(0 0% 60%)" }
                  : { borderColor: "hsl(0 0% 80%)", background: "white", color: "hsl(0 0% 70%)" }}>
                {r < voteRound ? "✗" : voteRound === r ? "●" : "○"}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-xl w-full space-y-4">
        {/* Shared assembly timer */}
        {(() => {
          const mins = Math.floor(timeLeft / 60).toString().padStart(2, "0");
          const secs = (timeLeft % 60).toString().padStart(2, "0");
          const tColor = timerExpired ? "hsl(0 0% 50%)" : timeLeft < 120 ? "hsl(354 78% 44%)" : timeLeft < 300 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)";
          const tBg = timerExpired ? "hsl(0 0% 90%)" : timeLeft < 120 ? "hsl(354 78% 96%)" : timeLeft < 300 ? "hsl(48 100% 92%)" : "hsl(210 80% 95%)";
          return (
            <div className="comic-panel bg-card flex items-center gap-4 px-5 py-2">
              <span style={{ color: tColor }}>⏱</span>
              <div
                className="font-mono text-2xl font-black px-3 py-0.5 border-2 tracking-widest"
                style={{ color: tColor, background: tBg, borderColor: tColor, fontFamily: "'Bangers', cursive", minWidth: "90px", textAlign: "center" }}
              >
                {timerExpired ? "TIME UP" : `${mins}:${secs}`}
              </div>
              <div>
                <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color: tColor }}>
                  {timerExpired ? "Time's up!" : "Assembly time remaining"}
                </p>
                <p className="font-mono text-xs text-muted-foreground">Continued from discussion</p>
              </div>
            </div>
          );
        })()}

        {/* Score info */}
        <div className="comic-panel bg-card p-4 flex items-center justify-between">
          <div>
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Badges for correct verdict:</p>
            <p className="font-black text-lg" style={{ fontFamily: "'Bangers', cursive", color: voteRound === 1 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)" }}>
              {voteRound === 1 ? "🏆×5 (first try)" : "🏆×3 (second try)"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">Votes in:</p>
            <p className="font-black text-xl" style={{ fontFamily: "'Bangers', cursive", color: "hsl(210 80% 40%)" }}>{votesIn}/4</p>
          </div>
        </div>

        {/* Question */}
        <div className="border-4 border-foreground p-4 bg-card text-center">
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-2">Case Question:</p>
          <p className="font-black text-lg text-foreground">
            What was the PRIMARY cause of Maya's situation?
          </p>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {vPhase === "voting" ? "All 4 detectives must vote — your vote must be unanimous!" : ""}
            {vPhase === "waiting" ? `You voted. Waiting for others... (${votesIn}/4)` : ""}
          </p>
        </div>

        {/* Verdict options */}
        {(vPhase === "voting" || vPhase === "waiting") && (
          <div className="space-y-2">
            {VERDICT_OPTIONS.map((opt) => {
              const isSelected = selected === opt.key;
              const voted = hasVoted;
              return (
                <button
                  key={opt.key}
                  disabled={voted}
                  onClick={() => !voted && setSelected(opt.key)}
                  className="w-full border-4 px-5 py-3 text-left font-mono text-sm transition-all duration-100 flex items-start gap-4"
                  style={
                    isSelected
                      ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)", cursor: voted ? "default" : "pointer" }
                      : { borderColor: "hsl(0 0% 75%)", background: "white", cursor: voted ? "default" : "pointer" }
                  }
                >
                  <span className="font-black text-lg shrink-0" style={{ color: isSelected ? "hsl(354 78% 44%)" : "hsl(0 0% 55%)", fontFamily: "'Bangers', cursive" }}>
                    {opt.key}
                  </span>
                  <span className={`flex-1 font-bold ${isSelected ? "text-foreground" : "text-foreground/70"}`}>
                    {opt.text}
                  </span>
                  {isSelected && <span className="font-black shrink-0" style={{ color: "hsl(354 78% 44%)" }}>◉</span>}
                </button>
              );
            })}

            {!hasVoted && (
              <button
                onClick={handleVote}
                disabled={!selected || loading}
                className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-50"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0 hsl(354 78% 28%)" }}
              >
                {loading ? "SUBMITTING..." : selected ? `CAST VOTE: ${selected}` : "SELECT AN OPTION FIRST"}
              </button>
            )}

            {hasVoted && (
              <div className="border-2 p-3 text-center font-mono text-sm" style={{ borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)" }}>
                <p className="font-black" style={{ color: "hsl(210 80% 40%)" }}>✓ Vote cast: <strong>{selected}</strong></p>
                <p className="text-muted-foreground text-xs mt-0.5 animate-pulse">Waiting for all 4 detectives... ({votesIn}/4)</p>
              </div>
            )}
          </div>
        )}

        {/* Result */}
        {vPhase === "result" && (
          <div className="space-y-3 slide-up">
            <div className="border-4 border-foreground p-5 text-center" style={{ background: resultBg, borderColor: resultColor }}>
              {correct ? (
                <>
                  <p className="text-4xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(210 80% 40%)" }}>
                    ✓ CORRECT!
                  </p>
                  <p className="font-mono text-sm text-foreground mt-1">
                    Unanimous verdict — all detectives agreed!
                  </p>
                  <div className="flex justify-center gap-1 mt-3 text-2xl">
                    {Array.from({ length: teamBadges }).map((_, i) => <span key={i}>🏆</span>)}
                  </div>
                  <p className="font-black text-lg mt-1" style={{ fontFamily: "'Bangers', cursive", color: "hsl(48 100% 40%)" }}>
                    {teamBadges} TEAM DETECTIVE BADGES EARNED!
                  </p>
                </>
              ) : !unanimous ? (
                <>
                  <p className="text-3xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(354 78% 44%)" }}>
                    ✗ NOT UNANIMOUS
                  </p>
                  <p className="font-mono text-sm text-muted-foreground mt-1">
                    Your squad didn't all pick the same option. Discuss and vote again!
                  </p>
                </>
              ) : (
                <>
                  <p className="text-3xl font-black tracking-widest" style={{ fontFamily: "'Bangers', cursive", color: "hsl(354 78% 44%)" }}>
                    ✗ WRONG VERDICT
                  </p>
                  <p className="font-mono text-sm text-muted-foreground mt-1">
                    You agreed on <strong>{agreedKey}</strong>, but that's not the right cause. Try again!
                  </p>
                </>
              )}
            </div>

            {/* Show correct answer if complete and wrong */}
            {voteComplete && !correct && (
              <div className="border-4 border-foreground p-4" style={{ background: "hsl(48 100% 50%)" }}>
                <p className="font-mono text-xs font-black tracking-widest uppercase mb-1">The correct answer was:</p>
                <p className="font-bold text-sm">
                  <strong>B)</strong> {VERDICT_OPTIONS.find(o => o.key === CORRECT_VERDICT_KEY)?.text}
                </p>
              </div>
            )}

            {/* Actions */}
            {voteComplete ? (
              <button
                onClick={() => setPhase("ending")}
                className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                style={{ background: "hsl(210 80% 40%)", boxShadow: "5px 5px 0 hsl(210 80% 25%)" }}
              >
                VIEW FINAL RESULTS →
              </button>
            ) : (
              <button
                onClick={() => {
                  setSelected(null);
                  setHasVoted(false);
                  setVPhase("voting");
                  resultShownRef.current = false;
                }}
                className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0 hsl(354 78% 28%)" }}
              >
                VOTE AGAIN (ROUND 2) →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
