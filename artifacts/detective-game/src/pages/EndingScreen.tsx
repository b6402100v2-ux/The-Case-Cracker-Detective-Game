import { useState, useEffect } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES, VERDICT_OPTIONS, CORRECT_VERDICT_KEY } from "@/game/types";

export default function EndingScreen() {
  const { state, fetchRoomStatus, resetGame } = useGame();
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [show, setShow] = useState({ scores: false, verdict: false, narrator: false, reset: false });

  useEffect(() => {
    fetchRoomStatus().then(setRoomStatus);
  }, [fetchRoomStatus]);

  useEffect(() => {
    const t1 = setTimeout(() => setShow((s) => ({ ...s, scores: true })), 300);
    const t2 = setTimeout(() => setShow((s) => ({ ...s, verdict: true })), 900);
    const t3 = setTimeout(() => setShow((s) => ({ ...s, narrator: true })), 1800);
    const t4 = setTimeout(() => setShow((s) => ({ ...s, reset: true })), 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  const panelScores = roomStatus?.panelScores ?? [];
  const panelBadges = roomStatus?.panelBadges ?? [];
  const members = roomStatus?.members ?? [];
  const teamBadges = roomStatus?.teamBadgesEarned ?? 0;
  const voteCorrect = roomStatus?.voteCorrect ?? false;
  const voteRound = roomStatus?.voteRoundNumber ?? 1;
  const agreedKey = roomStatus?.agreedKey;

  const individualBadgeCount = panelBadges.filter(Boolean).length;
  const totalBadges = individualBadgeCount + teamBadges;

  const overallRating =
    totalBadges >= 8 ? { label: "LEGENDARY SQUAD 🥇", color: "hsl(48 100% 45%)", textColor: "hsl(0 0% 10%)" } :
    totalBadges >= 6 ? { label: "ELITE DETECTIVES 🥈", color: "hsl(210 80% 40%)", textColor: "white" } :
    totalBadges >= 3 ? { label: "FIELD AGENTS 🥉", color: "hsl(354 78% 44%)", textColor: "white" } :
    { label: "ROOKIE SQUAD", color: "hsl(0 0% 55%)", textColor: "white" };

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
        {/* Header */}
        <div className="border-b-4 border-foreground px-6 py-4 text-center" style={{ background: "hsl(354 78% 44%)" }}>
          <div className={`inline-block sfx-burst text-xl mb-2 font-black ${show.scores ? "stamp-in" : "opacity-0"}`}
            style={{ background: overallRating.color, color: overallRating.textColor }}>
            CASE CLOSED
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{state.icon}</span>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              {state.codeName}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Overall rating */}
          <div className={`text-center transition-all duration-700 ${show.scores ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="inline-block border-4 px-6 py-2 text-2xl font-black tracking-widest rotate-[-3deg] mb-2"
              style={{ borderColor: overallRating.color, color: overallRating.color, fontFamily: "'Bangers', cursive" }}>
              {overallRating.label}
            </div>
            <p className="font-mono text-sm text-muted-foreground">
              Total badges: <strong>{totalBadges}</strong> ({individualBadgeCount} investigation + {teamBadges} verdict)
            </p>
          </div>

          {/* Individual panel scores */}
          <div>
            <p className="font-mono text-xs tracking-widest uppercase font-black mb-2" style={{ color: "hsl(210 80% 40%)" }}>
              Investigation Results:
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CLUES.map((clue, i) => {
                const score = panelScores[i] ?? null;
                const hasBadge = panelBadges[i] ?? false;
                const member = members.find((m) => m.panelIndex === i);
                const isMe = i === state.panelIndex;
                const accentColor = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 40%)", "hsl(354 78% 44%)"][i];
                const accentBg = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"][i];
                return (
                  <div
                    key={i}
                    className="border-2 p-3 transition-all duration-500"
                    style={{
                      borderColor: hasBadge ? "hsl(48 100% 40%)" : accentColor,
                      background: hasBadge ? "hsl(48 100% 92%)" : accentBg,
                      opacity: show.scores ? 1 : 0,
                      transform: show.scores ? "none" : "translateY(8px)",
                      transitionDelay: `${i * 100 + 200}ms`,
                    }}
                  >
                    <p className="text-xs font-mono text-muted-foreground tracking-widest uppercase">
                      {member?.studentName ?? `Panel ${i + 1}`}
                      {isMe && <span className="ml-1 opacity-60">(you)</span>}
                    </p>
                    <p className="text-xs font-mono text-muted-foreground">{clue.date}</p>
                    <p className="font-black text-lg mt-0.5" style={{ color: hasBadge ? "hsl(48 85% 28%)" : accentColor, fontFamily: "'Bangers', cursive" }}>
                      {score ?? "?"}/5 {hasBadge ? "🏆" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team verdict result */}
          {show.verdict && (
            <div className="slide-up">
              <p className="font-mono text-xs tracking-widest uppercase font-black mb-2" style={{ color: "hsl(354 78% 44%)" }}>
                Team Verdict:
              </p>
              <div className="border-4 border-foreground p-4" style={{ background: voteCorrect ? "hsl(210 80% 95%)" : "hsl(354 78% 96%)" }}>
                {voteCorrect ? (
                  <>
                    <p className="font-black text-lg" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>
                      ✓ CORRECT VERDICT — Round {voteRound}
                    </p>
                    <p className="font-mono text-sm mt-1">
                      {VERDICT_OPTIONS.find(o => o.key === agreedKey)?.text}
                    </p>
                    <div className="flex gap-1 mt-2 text-xl">
                      {Array.from({ length: teamBadges }).map((_, i) => <span key={i}>🏆</span>)}
                      <span className="font-black ml-2" style={{ color: "hsl(48 100% 40%)" }}>{teamBadges} badges</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="font-black text-lg" style={{ color: "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>
                      ✗ VERDICT MISSED — No badges
                    </p>
                    <p className="font-mono text-sm mt-1 text-muted-foreground">
                      The correct answer: <strong>B) {VERDICT_OPTIONS.find(o => o.key === CORRECT_VERDICT_KEY)?.text}</strong>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Narrator */}
          {show.narrator && (
            <div className="slide-up border-l-4 p-4 font-mono text-sm leading-relaxed bg-muted" style={{ borderColor: "hsl(210 80% 40%)" }}>
              <span className="font-black" style={{ color: "hsl(354 78% 44%)" }}>NARRATOR: </span>
              <span className="text-muted-foreground">
                By reading Maya's diary across four domains — family, school, romance, and the digital world —
                you traced the full impact of coordinated cyberbullying. Maya is now recovering and
                receiving support. The "Burn Page" has been taken down.
              </span>
              <br /><br />
              <span className="font-black" style={{ color: "hsl(210 80% 40%)" }}>REMEMBER: </span>
              <span className="text-muted-foreground">
                Cyberbullying affects every part of a person's life. If you see something, say something.
                You can always reach out to a trusted adult or counselor.
              </span>
            </div>
          )}

          {show.narrator && (
            <div className="text-center stamp-in">
              <span className="text-4xl font-black" style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive", letterSpacing: "0.15em" }}>
                — THE END —
              </span>
            </div>
          )}

          {show.reset && (
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
