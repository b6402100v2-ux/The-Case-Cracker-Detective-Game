import { useState, useEffect, useRef } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

const ASSEMBLY_DURATION = 600;
const TIMER_KEY = "assemblyTimerStart";

export default function CollaborationScreen() {
  const { state, fetchRoomStatus, setPhase, assemblyJoin } = useGame();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const [timeLeft, setTimeLeft] = useState(ASSEMBLY_DURATION);
  const [timerExpired, setTimerExpired] = useState(false);
  const [revealedScores, setRevealedScores] = useState<boolean[]>([false, false, false, false]);
  const joinedRef = useRef(false);
  const discussionStartedRef = useRef(false);

  useEffect(() => {
    if (!joinedRef.current) {
      joinedRef.current = true;
      assemblyJoin();
    }
  }, [assemblyJoin]);

  useEffect(() => {
    const poll = async () => {
      const s = await fetchRoomStatus();
      setStatus(s);
      if (s?.allInAssembly && !discussionStartedRef.current) {
        discussionStartedRef.current = true;
        if (!sessionStorage.getItem(TIMER_KEY)) {
          sessionStorage.setItem(TIMER_KEY, Date.now().toString());
        }
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus]);

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

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor = timerExpired ? "hsl(0 0% 50%)" : timeLeft < 120 ? "hsl(354 78% 44%)" : timeLeft < 300 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)";
  const timerBg = timerExpired ? "hsl(0 0% 90%)" : timeLeft < 120 ? "hsl(354 78% 96%)" : timeLeft < 300 ? "hsl(48 100% 92%)" : "hsl(210 80% 95%)";

  const assemblyCount = status?.assemblyMembers.length ?? 0;
  const allArrived = status?.allInAssembly ?? false;
  const panelScores = status?.panelScores ?? [null, null, null, null];
  const panelBadges = status?.panelBadges ?? [false, false, false, false];
  const members = status?.members ?? [];

  const accentColors = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 40%)", "hsl(354 78% 44%)"];
  const accentBgs = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-5 px-4">
      {TOP_BAR}

      {/* Header */}
      <div className="mt-6 mb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-1">
          <span className="text-3xl">{state.icon}</span>
          <h2 className="text-4xl font-black tracking-widest" style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive" }}>
            ASSEMBLY ROOM
          </h2>
        </div>
        <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase">{state.codeName} — All detectives, report in!</p>
      </div>

      {/* Waiting for all to arrive */}
      {!allArrived ? (
        <div className="comic-panel bg-card max-w-md w-full overflow-hidden mb-4">
          <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(210 80% 40%)" }}>
            <h3 className="text-2xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              WAITING FOR SQUAD ({assemblyCount}/4)
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {[0, 1, 2, 3].map((i) => {
              const member = members.find((m) => m.panelIndex === i);
              const inAssembly = status?.assemblyMembers.includes(i) ?? false;
              const isMe = i === state.panelIndex;
              return (
                <div
                  key={i}
                  className="border-2 px-4 py-2.5 flex items-center gap-3 transition-all duration-300"
                  style={
                    inAssembly
                      ? { borderColor: accentColors[i], background: accentBgs[i] }
                      : { borderColor: "hsl(0 0% 80%)", background: "white" }
                  }
                >
                  <span className="text-xl">{CLUES[i].icon}</span>
                  <div className="flex-1">
                    <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">{CLUES[i].loc}</p>
                    <p className="font-black text-sm">
                      {member?.studentName ?? `Panel ${i + 1}`}
                      {isMe && <span className="ml-2 font-mono text-xs" style={{ color: accentColors[i] }}>(you)</span>}
                    </p>
                  </div>
                  <span className="font-black text-lg">
                    {inAssembly ? <span style={{ color: "hsl(210 80% 40%)" }}>✓</span> : <span className="animate-pulse text-muted-foreground">○</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-center font-mono text-xs text-muted-foreground pb-4 animate-pulse">Checking every 2 seconds...</p>
        </div>
      ) : (
        /* Discussion phase */
        <div className="max-w-2xl w-full space-y-4">
          {/* Timer HUD */}
          <div className="comic-panel bg-card flex items-center gap-4 px-5 py-2">
            <span style={{ color: timerColor }}>⏱</span>
            <div
              className="font-mono text-2xl font-black px-3 py-0.5 border-2 tracking-widest"
              style={{ color: timerColor, background: timerBg, borderColor: timerColor, fontFamily: "'Bangers', cursive", minWidth: "90px", textAlign: "center" }}
            >
              {timerExpired ? "TIME UP" : `${minutes}:${seconds}`}
            </div>
            <div>
              <p className="font-mono text-xs font-black uppercase tracking-widest" style={{ color: timerColor }}>
                {timerExpired ? "Time's up — proceed to vote!" : "Discussion + voting time"}
              </p>
              <p className="font-mono text-xs text-muted-foreground">Timer continues into the verdict screen</p>
            </div>
          </div>

          {/* Panel score reveal cards */}
          <div>
            <p className="font-mono text-xs font-black tracking-widest uppercase mb-2" style={{ color: "hsl(210 80% 40%)" }}>
              ▶ Reveal investigation scores — discuss each finding:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {CLUES.map((clue, i) => {
                const score = panelScores[i];
                const hasBadge = panelBadges[i];
                const member = members.find((m) => m.panelIndex === i);
                const isMe = i === state.panelIndex;
                return (
                  <div key={i} className="comic-panel bg-card overflow-hidden">
                    <div className="border-b-2 border-foreground px-3 py-1.5 flex items-center gap-2" style={{ background: accentColors[i] }}>
                      <span className="text-sm">{clue.icon}</span>
                      <span className="text-sm font-black text-white tracking-wide flex-1 truncate">
                        {member?.studentName ?? `Panel ${i + 1}`}
                        {isMe && <span className="ml-1 text-white/70 text-xs">(you)</span>}
                      </span>
                    </div>
                    <div className="p-2.5">
                      <p className="font-mono text-xs text-muted-foreground truncate mb-1.5">{clue.date}</p>
                      <button
                        onClick={() => setRevealedScores((r) => r.map((v, idx) => idx === i ? !v : v))}
                        className="w-full text-left border-2 px-2 py-1.5 font-mono text-xs transition-all"
                        style={revealedScores[i]
                          ? { borderColor: accentColors[i], background: accentBgs[i] }
                          : { borderColor: "hsl(0 0% 80%)", background: "hsl(0 0% 98%)", color: "hsl(0 0% 50%)" }}
                      >
                        {revealedScores[i] ? (
                          <span className="font-black">
                            {score ?? "?"}/5 {hasBadge ? "🏆" : ""} {(score ?? 0) >= 3 ? "✓ PASSED" : "✗ PARTIAL"}
                          </span>
                        ) : "[ REVEAL SCORE ]"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Discussion guide */}
          <div className="comic-panel-cyan bg-card p-4">
            <p className="text-xs font-mono font-black tracking-widest uppercase mb-2" style={{ color: "hsl(210 80% 40%)" }}>
              ▶ Discussion Guide — share with your squad:
            </p>
            <div className="space-y-1">
              {[
                `🍽️ ${members.find(m => m.panelIndex === 0)?.studentName ?? "Det. 1"}: How did Maya hide her pain from her family?`,
                `🎨 ${members.find(m => m.panelIndex === 1)?.studentName ?? "Det. 2"}: What clue showed the bullying had reached school?`,
                `🌊 ${members.find(m => m.panelIndex === 2)?.studentName ?? "Det. 3"}: How did online bullying invade her relationship?`,
                `⚡ ${members.find(m => m.panelIndex === 3)?.studentName ?? "Det. 4"}: What was the final breaking point in the digital entry?`,
              ].map((item, i) => (
                <p key={i} className="text-xs font-mono text-foreground/80 bg-muted px-3 py-1.5 border border-foreground/10">{item}</p>
              ))}
            </div>
          </div>

          {/* Go to vote */}
          <div className="space-y-2">
            <div className="border-4 border-foreground p-4 text-center" style={{ background: "hsl(48 100% 50%)" }}>
              <p className="font-black text-sm text-foreground uppercase tracking-widest">
                Ready to vote? All detectives must reach the verdict screen at the same time.
              </p>
              <p className="font-mono text-xs text-foreground/70 mt-1">
                Discuss the evidence, then proceed when your squad is ready.
              </p>
            </div>
            <button
              onClick={() => setPhase("verdict")}
              className="comic-panel w-full text-white py-4 text-2xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
              style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0 hsl(354 78% 28%)" }}
            >
              PROCEED TO VERDICT →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
