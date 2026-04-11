import { useEffect, useRef } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

const PANEL_LABELS = ["Family", "School", "Romance", "Digital Storm"];
const PANEL_ICONS = ["🍽️", "🎨", "🌊", "⚡"];

export default function WaitingJoinScreen() {
  const { state, fetchRoomStatus, setPhase } = useGame();
  const statusRef = useRef<RoomStatus | null>(null);

  useEffect(() => {
    const poll = async () => {
      const status = await fetchRoomStatus();
      statusRef.current = status;
      if (status?.allJoined) {
        setPhase("individual");
      }
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus, setPhase]);

  const status = statusRef.current;
  const count = status?.memberCount ?? 1;
  const slots = [0, 1, 2, 3];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
        <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(210 80% 40%)" }}>
          <p className="font-mono text-xs text-white/70 uppercase tracking-widest">Squad Assembling</p>
          <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
            WAITING FOR SQUAD
          </h2>
        </div>

        <div className="p-5 space-y-4">
          {/* Squad info */}
          <div className="text-center">
            <div className="text-4xl mb-1">{state.icon}</div>
            <p className="font-black text-lg tracking-widest uppercase" style={{ fontFamily: "'Bangers', cursive", color: "hsl(354 78% 44%)" }}>
              {state.codeName}
            </p>
            <p className="font-mono text-xs text-muted-foreground tracking-widest">
              {count}/4 detectives joined
            </p>
          </div>

          {/* Detective slots */}
          <div className="space-y-2">
            {slots.map((i) => {
              const member = status?.members.find((m) => m.panelIndex === i);
              const isMe = i === state.panelIndex;
              const filled = !!member;
              return (
                <div
                  key={i}
                  className="border-2 px-4 py-2.5 flex items-center gap-3 transition-all duration-300"
                  style={
                    isMe
                      ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)" }
                      : filled
                      ? { borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)" }
                      : { borderColor: "hsl(0 0% 80%)", background: "hsl(0 0% 98%)" }
                  }
                >
                  <span className="text-xl">{PANEL_ICONS[i]}</span>
                  <div className="flex-1">
                    <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                      Panel {i + 1} — {PANEL_LABELS[i]}
                    </p>
                    <p className="font-black text-sm">
                      {filled ? member.studentName : "Waiting..."}
                      {isMe && <span className="ml-2 font-mono text-xs" style={{ color: "hsl(354 78% 44%)" }}>(you)</span>}
                    </p>
                  </div>
                  <span className="font-black text-lg">
                    {filled ? "✓" : <span className="animate-pulse text-muted-foreground">○</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Your panel preview */}
          <div className="border-4 border-foreground p-3 text-center" style={{ background: "hsl(48 100% 50%)" }}>
            <p className="font-mono text-xs font-black tracking-widest uppercase mb-0.5">Your Assignment:</p>
            <p className="font-black text-base">
              Panel {state.panelIndex + 1} — {CLUES[state.panelIndex].date}: {CLUES[state.panelIndex].loc}
            </p>
            <p className="font-mono text-xs text-foreground/70">{CLUES[state.panelIndex].domain}</p>
          </div>

          <p className="text-center font-mono text-xs text-muted-foreground tracking-widest animate-pulse">
            Checking every 2 seconds...
          </p>
        </div>
      </div>
    </div>
  );
}
