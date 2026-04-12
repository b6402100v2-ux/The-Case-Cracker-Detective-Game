import { useEffect, useRef } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

const PANEL_ICONS = ["🍽️", "🎨", "🌊", "⚡"];
const PANEL_LABELS = ["Family", "School", "Romance", "Digital Storm"];

const RED = "hsl(354 78% 44%)";
const BLUE = "hsl(210 80% 40%)";
const YELLOW = "hsl(48 100% 50%)";
const YELLOW_DARK = "hsl(48 85% 35%)";

export default function WaitingJoinScreen() {
  const { state, fetchRoomStatus, setPhase } = useGame();
  const statusRef = useRef<RoomStatus | null>(null);

  useEffect(() => {
    const poll = async () => {
      const status = await fetchRoomStatus();
      statusRef.current = status;
      if (status?.allJoined) setPhase("individual");
    };
    poll();
    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus, setPhase]);

  const status = statusRef.current;
  const count = status?.memberCount ?? 1;

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4 gap-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: RED }} />
        <div className="flex-1" style={{ background: BLUE }} />
        <div className="flex-1" style={{ background: YELLOW }} />
        <div className="flex-1" style={{ background: RED }} />
      </div>

      {/* Squad waiting card */}
      <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
        <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: BLUE }}>
          <p className="font-mono text-xs text-white/70 uppercase tracking-widest">Squad Assembling</p>
          <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
            WAITING FOR SQUAD
          </h2>
        </div>

        <div className="p-5 space-y-4">
          <div className="text-center">
            <div className="text-4xl mb-1">{state.icon}</div>
            <p className="font-black text-lg tracking-widest uppercase" style={{ fontFamily: "'Bangers', cursive", color: RED }}>
              {state.codeName}
            </p>
            <p className="font-mono text-xs text-muted-foreground tracking-widest">
              {count}/4 detectives joined
            </p>
          </div>

          {/* Detective slots */}
          <div className="space-y-2">
            {[0, 1, 2, 3].map((i) => {
              const member = status?.members.find((m) => m.panelIndex === i);
              const isMe = i === state.panelIndex;
              const filled = !!member;
              return (
                <div
                  key={i}
                  className="border-2 px-4 py-2.5 flex items-center gap-3 transition-all duration-300"
                  style={
                    isMe ? { borderColor: RED, background: "hsl(354 78% 96%)" }
                    : filled ? { borderColor: BLUE, background: "hsl(210 80% 95%)" }
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
                      {isMe && <span className="ml-2 font-mono text-xs" style={{ color: RED }}>(you)</span>}
                    </p>
                  </div>
                  <span className="font-black text-lg">
                    {filled ? <span style={{ color: BLUE }}>✓</span> : <span className="animate-pulse text-muted-foreground">○</span>}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Your assignment */}
          <div className="border-4 border-foreground p-3 text-center" style={{ background: YELLOW }}>
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

      {/* Mission brief card */}
      <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
        <div className="border-b-4 border-foreground px-5 py-2 text-center" style={{ background: RED }}>
          <h3 className="text-2xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
            📋 MISSION BRIEF
          </h3>
          <p className="font-mono text-xs text-white/75 uppercase tracking-widest">Read this while you wait!</p>
        </div>

        <div className="p-5 space-y-4">
          {/* What you will do */}
          <div>
            <p className="font-black text-sm uppercase tracking-wide mb-2" style={{ color: BLUE, fontFamily: "'Bangers', cursive", fontSize: "1rem" }}>
              What you will do:
            </p>
            <div className="space-y-2">
              {[
                { n: "1", t: "Read a diary entry", d: "Your panel contains a real diary page written by Maya. Read it carefully — the answers are hidden inside the text." },
                { n: "2", t: "Answer 5 questions", d: "Each question is multiple choice (A, B, or C). Select your answer and tap CHECK ANSWERS to see how you did." },
                { n: "3", t: "Fix wrong answers", d: "Wrong answers show a hint pointing back to the exact part of the diary. Re-read it and try again — you can check as many times as you need." },
                { n: "4", t: "Lock your panel", d: "Once all 5 answers are correct (or the 10-minute timer runs out), you lock your panel and head to the Assembly Room." },
              ].map(({ n, t, d }) => (
                <div key={n} className="flex gap-3 items-start">
                  <div className="shrink-0 w-6 h-6 border-2 border-foreground flex items-center justify-center font-black text-xs" style={{ background: RED, color: "white" }}>
                    {n}
                  </div>
                  <div>
                    <p className="font-black text-sm text-foreground">{t}</p>
                    <p className="font-mono text-xs italic" style={{ color: "hsl(0 0% 32%)" }}>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge system */}
          <div className="border-4 border-foreground p-4 space-y-2" style={{ background: "hsl(48 100% 95%)" }}>
            <p className="font-black text-sm uppercase tracking-wide" style={{ color: YELLOW_DARK, fontFamily: "'Bangers', cursive", fontSize: "1rem" }}>
              🏆 How to earn badges:
            </p>
            <div className="space-y-2">
              <div className="flex gap-3 items-start">
                <span className="text-lg shrink-0">🏆</span>
                <div>
                  <p className="font-black text-sm" style={{ color: YELLOW_DARK }}>Panel Badge</p>
                  <p className="font-mono text-xs italic" style={{ color: "hsl(0 0% 32%)" }}>
                    Get all 5 answers correct before the 10-minute timer runs out.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg shrink-0">🏆×5</span>
                <div>
                  <p className="font-black text-sm" style={{ color: YELLOW_DARK }}>Team Verdict — 5 Badges</p>
                  <p className="font-mono text-xs italic" style={{ color: "hsl(0 0% 32%)" }}>
                    All 4 detectives vote unanimously for the correct cause on the FIRST try in the Assembly Room.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <span className="text-lg shrink-0">🏆×3</span>
                <div>
                  <p className="font-black text-sm" style={{ color: YELLOW_DARK }}>Team Verdict — 3 Badges</p>
                  <p className="font-mono text-xs italic" style={{ color: "hsl(0 0% 32%)" }}>
                    All 4 detectives vote unanimously for the correct cause on the SECOND try.
                  </p>
                </div>
              </div>
              <div className="border-t border-foreground/15 pt-2 mt-1">
                <p className="font-mono text-xs font-black text-center" style={{ color: RED }}>
                  7–9 total badges = 🏆 GREAT DETECTIVES trophy!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
