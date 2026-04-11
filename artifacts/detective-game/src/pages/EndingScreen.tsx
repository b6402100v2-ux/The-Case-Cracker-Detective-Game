import { useState, useEffect } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function EndingScreen() {
  const { state, fetchRoomStatus, resetGame } = useGame();
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [showVerdict, setShowVerdict] = useState(false);
  const [showNarrator, setShowNarrator] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    fetchRoomStatus().then(setRoomStatus);
  }, [fetchRoomStatus]);

  useEffect(() => {
    const t1 = setTimeout(() => setRevealed(true), 300);
    const t2 = setTimeout(() => setShowVerdict(true), 900);
    const t3 = setTimeout(() => setShowNarrator(true), 1800);
    const t4 = setTimeout(() => setShowReset(true), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const panelScores = roomStatus?.panelScores ?? [state.score, null, null, null];
  const members = roomStatus?.members ?? [];
  const totalScore = panelScores.reduce<number>((a, b) => a + (b ?? 0), 0);
  const maxScore = CLUES.reduce((a, c) => a + c.questions.length, 0);
  const pct = maxScore > 0 ? totalScore / maxScore : 0;
  const verdict = roomStatus?.verdict ?? "";

  const badge =
    pct >= 0.9 ? { label: "GOLD MEDAL 🥇", color: "hsl(48 100% 45%)", textColor: "hsl(0 0% 10%)" } :
    pct >= 0.7 ? { label: "PANEL BADGE 🥈", color: "hsl(210 80% 40%)", textColor: "white" } :
    pct >= 0.5 ? { label: "FIELD AGENT", color: "hsl(354 78% 44%)", textColor: "white" } :
    { label: "TRAINEE", color: "hsl(0 0% 55%)", textColor: "white" };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-6 px-4 relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      <div className="fixed top-8 left-4 sfx-burst text-xs opacity-40 font-black" style={{ background: "hsl(210 80% 40%)", color: "white" }}>CASE CLOSED!</div>
      <div className="fixed bottom-10 right-4 sfx-burst text-xs opacity-40 font-black" style={{ background: "hsl(354 78% 44%)", color: "white" }}>SOLVED!</div>

      <div className="comic-panel bg-card max-w-xl w-full overflow-hidden mt-6">
        <div className="border-b-4 border-foreground px-6 py-4 text-center" style={{ background: "hsl(354 78% 44%)" }}>
          <div className={`inline-block sfx-burst text-xl mb-2 font-black ${revealed ? "stamp-in" : "opacity-0"}`}
            style={{ background: badge.color, color: badge.textColor }}>
            CASE CLOSED
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{state.icon}</span>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              {state.codeName}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Badge + total */}
          <div className={`text-center transition-all duration-700 ${revealed ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="inline-block border-4 px-6 py-2 text-2xl font-black tracking-widest rotate-[-3deg] mb-2"
              style={{ borderColor: badge.color, color: badge.color, fontFamily: "'Bangers', cursive" }}>
              {badge.label}
            </div>
            <p className="text-muted-foreground font-mono text-sm">
              Combined score: <strong>{totalScore}/{maxScore}</strong> ({Math.round(pct * 100)}%)
            </p>
          </div>

          {/* Per-detective scores */}
          <div className="grid grid-cols-2 gap-3">
            {CLUES.map((clue, i) => {
              const score = panelScores[i];
              const max = clue.questions.length;
              const passing = (score ?? 0) >= 3;
              const member = members.find((m) => m.panelIndex === i);
              const isMe = i === state.panelIndex;
              return (
                <div
                  key={i}
                  className="border-2 p-3 transition-all duration-500"
                  style={{
                    borderColor: passing ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)",
                    background: passing ? "hsl(210 80% 95%)" : "hsl(354 78% 96%)",
                    opacity: revealed ? 1 : 0,
                    transform: revealed ? "none" : "translateY(8px)",
                    transitionDelay: `${i * 120 + 200}ms`,
                  }}
                >
                  <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                    {member?.studentName ?? `Panel ${i + 1}`}
                    {isMe && <span className="ml-1 opacity-60">(you)</span>}
                  </p>
                  <p className="text-xs font-mono text-muted-foreground">{clue.date} — {clue.loc}</p>
                  <p className="font-black text-lg mt-0.5" style={{ color: passing ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>
                    {score ?? "?"}/{max} {passing ? "✓" : "✗"}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Verdict */}
          {showVerdict && verdict && (
            <div className="slide-up border-4 border-foreground p-4" style={{ background: "hsl(48 100% 50%)" }}>
              <p className="text-xs font-mono font-black tracking-widest uppercase mb-2 text-foreground">SQUAD CONCLUSION:</p>
              <p className="font-mono text-sm text-foreground italic">"{verdict}"</p>
            </div>
          )}

          {/* Narrator */}
          {showNarrator && (
            <div className="slide-up border-l-4 p-4 font-mono text-sm leading-relaxed bg-muted" style={{ borderColor: "hsl(210 80% 40%)" }}>
              <span className="font-black" style={{ color: "hsl(354 78% 44%)" }}>NARRATOR: </span>
              <span className="text-muted-foreground">
                The evidence is clear. By reading Maya's diary across four domains — family, school,
                romance, and the digital world — you've traced the full impact of cyberbullying.
                Maya is recovering and receiving support. The "Burn Page" has been taken down.
              </span>
              <br /><br />
              <span className="font-black" style={{ color: "hsl(210 80% 40%)" }}>REMEMBER: </span>
              <span className="text-muted-foreground">
                Cyberbullying affects every part of a person's life. If you see something, say something.
              </span>
            </div>
          )}

          {showNarrator && (
            <div className="text-center stamp-in">
              <span className="text-4xl font-black" style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive", letterSpacing: "0.15em" }}>
                — THE END —
              </span>
            </div>
          )}

          {showReset && (
            <button
              onClick={resetGame}
              className="slide-up comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95"
              style={{ background: "hsl(210 80% 40%)", boxShadow: "4px 4px 0 hsl(210 80% 25%)" }}
            >
              ↩ PLAY AGAIN
            </button>
          )}
        </div>

        <div className="flex h-3">
          <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
          <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
          <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
          <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        </div>
      </div>
    </div>
  );
}
