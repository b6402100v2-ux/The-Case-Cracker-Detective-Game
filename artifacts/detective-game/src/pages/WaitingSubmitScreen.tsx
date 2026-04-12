import { useEffect, useRef, useState } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function WaitingSubmitScreen() {
  const { state, fetchRoomStatus, setPhase } = useGame();
  const [status, setStatus] = useState<RoomStatus | null>(null);
  const calledRef = useRef(false);

  useEffect(() => {
    const poll = async () => {
      const s = await fetchRoomStatus();
      setStatus(s);
      if (s?.allSubmitted && !calledRef.current) {
        calledRef.current = true;
        setTimeout(() => setPhase("collaboration"), 800);
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus, setPhase]);

  const submitted = status?.members.filter((m) => m.submitted).length ?? 1;
  const clue = CLUES[state.panelIndex];
  const accentColor = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 50%)", "hsl(354 78% 44%)"][state.panelIndex];
  const accentText = ["white", "white", "hsl(0 0% 10%)", "white"][state.panelIndex];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
        <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: accentColor }}>
          <p className="font-mono text-xs uppercase tracking-widest" style={{ color: accentText, opacity: 0.7 }}>Panel Locked</p>
          <h2 className="text-3xl font-black tracking-widest" style={{ color: accentText, fontFamily: "'Bangers', cursive" }}>
            WAITING FOR SQUAD
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {/* Your result */}
          <div className="text-center border-4 border-foreground p-4" style={{ background: state.hasBadge ? "hsl(48 100% 50%)" : "hsl(0 0% 95%)" }}>
            {state.hasBadge ? (
              <>
                <p className="text-3xl font-black" style={{ fontFamily: "'Bangers', cursive" }}>🏆 BADGE EARNED!</p>
                <p className="font-mono text-sm mt-1">Score: <strong>{state.score}/5</strong> — Perfect!</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-black" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 40%)" }}>
                  {state.score}/5 — No Badge
                </p>
                <p className="font-mono text-xs text-muted-foreground mt-1">{clue.date}: {clue.loc}</p>
              </>
            )}
          </div>

          {/* Progress */}
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground text-center">
            {submitted}/4 detectives locked their panels
          </p>
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => {
              const member = status?.members.find((m) => m.panelIndex === i);
              const done = member?.submitted ?? false;
              const badge = member?.hasBadge ?? false;
              const isMe = i === state.panelIndex;
              return (
                <div
                  key={i}
                  className="border-2 px-3 py-2 flex items-center gap-3"
                  style={
                    done
                      ? { borderColor: badge ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)", background: badge ? "hsl(48 100% 92%)" : "hsl(210 80% 95%)" }
                      : { borderColor: "hsl(0 0% 80%)", background: "white" }
                  }
                >
                  <span className="text-base">{CLUES[i].icon}</span>
                  <span className="font-mono text-sm flex-1">
                    {member?.studentName ?? `Panel ${i + 1}`}
                    {isMe && <span className="ml-1 text-xs opacity-60">(you)</span>}
                  </span>
                  <span className="font-black text-sm">
                    {done
                      ? badge ? "🏆 ✓" : "✓"
                      : <span className="animate-pulse text-muted-foreground">waiting...</span>}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-center font-mono text-xs text-muted-foreground">
            Don't share answers yet — discuss together in the Assembly Room!
          </p>

          {status?.allSubmitted && (
            <div className="text-center slide-up">
              <p className="font-black text-xl animate-pulse" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>
                ALL PANELS LOCKED! ASSEMBLING...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
