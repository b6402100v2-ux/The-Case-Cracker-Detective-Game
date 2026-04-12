import { useState, useEffect } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES, VERDICT_OPTIONS, CORRECT_VERDICT_KEY } from "@/game/types";

function StarBurst({ count }: { count: number }) {
  return (
    <div className="flex justify-center gap-1 flex-wrap my-1">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-2xl stamp-in" style={{ animationDelay: `${i * 80}ms` }}>⭐</span>
      ))}
    </div>
  );
}

function getRating(total: number) {
  if (total >= 7) return {
    label: "GREAT DETECTIVES",
    trophy: "🏆",
    color: "hsl(48 100% 40%)",
    bg: "hsl(48 100% 50%)",
    textColor: "hsl(0 0% 10%)",
    compliment: "Outstanding! Your squad cracked the case with flying colours. You are true champions of justice!",
    celebrate: true,
    stars: total,
  };
  if (total >= 4) return {
    label: "GOOD INVESTIGATORS",
    trophy: "🥈",
    color: "hsl(210 80% 40%)",
    bg: "hsl(210 80% 95%)",
    textColor: "hsl(210 80% 25%)",
    compliment: "Well done! Your squad worked together and uncovered important evidence. Keep honing your detective skills!",
    celebrate: false,
    stars: total,
  };
  if (total >= 1) return {
    label: "FIELD AGENTS IN TRAINING",
    trophy: "🥉",
    color: "hsl(354 78% 44%)",
    bg: "hsl(354 78% 96%)",
    textColor: "hsl(354 78% 28%)",
    compliment: "Good effort! Every great detective starts somewhere. Re-read the diaries and you'll see what you missed!",
    celebrate: false,
    stars: total,
  };
  return {
    label: "ROOKIE SQUAD",
    trophy: "🔰",
    color: "hsl(0 0% 50%)",
    bg: "hsl(0 0% 96%)",
    textColor: "hsl(0 0% 25%)",
    compliment: "Don't give up! The case is complex, and the best detectives keep coming back with fresh eyes. Try again!",
    celebrate: false,
    stars: 0,
  };
}

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
  const rating = getRating(totalBadges);

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-6 px-4 relative overflow-hidden">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Celebration decorations for Great Detectives */}
      {rating.celebrate && show.scores && (
        <>
          <div className="fixed top-8 left-4 sfx-burst text-sm opacity-60 font-black stamp-in" style={{ background: "hsl(354 78% 44%)", color: "white" }}>CASE CLOSED!</div>
          <div className="fixed top-12 right-4 sfx-burst text-sm opacity-60 font-black stamp-in" style={{ background: "hsl(210 80% 40%)", color: "white", animationDelay: "200ms" }}>SOLVED!</div>
          <div className="fixed bottom-12 left-6 sfx-burst text-xs opacity-50 font-black stamp-in" style={{ background: "hsl(48 100% 50%)", color: "hsl(0 0% 10%)", animationDelay: "400ms" }}>AMAZING!</div>
          <div className="fixed bottom-20 right-6 sfx-burst text-xs opacity-50 font-black stamp-in" style={{ background: "hsl(354 78% 44%)", color: "white", animationDelay: "600ms" }}>WOW!</div>
        </>
      )}

      <div className="comic-panel bg-card max-w-xl w-full overflow-hidden mt-6">
        {/* Header — gold for Great Detectives */}
        <div className="border-b-4 border-foreground px-6 py-5 text-center" style={{ background: rating.celebrate ? "hsl(48 100% 50%)" : "hsl(354 78% 44%)" }}>
          {show.scores && (
            <div className={`text-5xl mb-1 stamp-in`}>{rating.trophy}</div>
          )}
          <div className={`inline-block sfx-burst text-sm mb-2 font-black transition-all duration-500 ${show.scores ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
            style={{ background: rating.celebrate ? "hsl(354 78% 44%)" : "hsl(48 100% 50%)", color: rating.celebrate ? "white" : "hsl(0 0% 10%)" }}>
            {rating.celebrate ? "CASE CLOSED!" : "MISSION COMPLETE"}
          </div>
          <div className="flex items-center justify-center gap-3">
            <span className="text-2xl">{state.icon}</span>
            <h2 className="text-3xl font-black text-foreground tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              {state.codeName}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Rating banner */}
          <div className={`text-center transition-all duration-700 ${show.scores ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}>
            <div className="border-4 px-6 py-3 inline-block mb-2"
              style={{ borderColor: rating.color, background: rating.bg, transform: "rotate(-2deg)" }}>
              <p className="text-2xl font-black tracking-widest" style={{ color: rating.textColor, fontFamily: "'Bangers', cursive" }}>
                {rating.trophy} {rating.label}
              </p>
            </div>

            {/* Celebration stars for 7-9 badges */}
            {rating.celebrate && <StarBurst count={Math.min(totalBadges, 9)} />}

            <p className="font-mono text-sm text-muted-foreground mt-2 max-w-sm mx-auto">{rating.compliment}</p>

            <p className="font-mono text-xs text-muted-foreground mt-2">
              Total badges: <strong>{totalBadges}/9</strong>
              <span className="ml-2 text-muted-foreground/60">({individualBadgeCount} investigation + {teamBadges} verdict)</span>
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
                    <div className="flex gap-1 mt-2 text-xl flex-wrap">
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
                      Correct: <strong>B) {VERDICT_OPTIONS.find(o => o.key === CORRECT_VERDICT_KEY)?.text}</strong>
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
