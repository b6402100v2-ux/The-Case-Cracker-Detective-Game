import { useState, useEffect } from "react";
import { useGame, type RoomStatus } from "@/game/GameContext";
import { CLUES } from "@/game/types";

export default function CollaborationScreen() {
  const { state, fetchRoomStatus, submitVerdict } = useGame();
  const [roomStatus, setRoomStatus] = useState<RoomStatus | null>(null);
  const [verdict, setVerdict] = useState("");
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false, false]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetchRoomStatus().then(setRoomStatus);
    const interval = setInterval(() => fetchRoomStatus().then(setRoomStatus), 3000);
    return () => clearInterval(interval);
  }, [fetchRoomStatus]);

  useEffect(() => {
    if (!timerActive) return;
    const t = setInterval(() => setTimeLeft((t) => (t > 0 ? t - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [timerActive]);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  const timerColor = timeLeft < 60 ? "hsl(354 78% 44%)" : timeLeft < 180 ? "hsl(48 100% 40%)" : "hsl(210 80% 40%)";

  const panelScores = roomStatus?.panelScores ?? [null, null, null, null];
  const totalScore = panelScores.reduce<number>((a, b) => a + (b ?? 0), 0);
  const maxScore = CLUES.reduce((a, c) => a + c.questions.length, 0);

  const accentColors = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 40%)", "hsl(354 78% 44%)"];
  const accentBg = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"];

  const handleSubmit = async () => {
    if (!verdict.trim()) { setError("Write a verdict before submitting!"); return; }
    setLoading(true);
    setError("");
    await submitVerdict(verdict);
    setLoading(false);
  };

  const members = roomStatus?.members ?? [];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-6 px-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Header */}
      <div className="mt-6 mb-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-3xl">{state.icon}</span>
          <h2 className="text-4xl font-black tracking-widest" style={{ color: "hsl(354 78% 44%)", textShadow: "3px 3px 0 hsl(354 78% 28%)", fontFamily: "'Bangers', cursive" }}>
            SQUAD ASSEMBLED
          </h2>
        </div>
        <p className="text-muted-foreground font-mono text-sm tracking-widest">{state.codeName} — COMPARE YOUR FINDINGS</p>
      </div>

      {/* Timer + combined score */}
      <div className="comic-panel bg-card px-5 py-3 mb-4 flex items-center gap-6">
        <div className="flex items-center gap-3">
          <span className="text-muted-foreground font-mono text-xs tracking-widest">TIME:</span>
          <span className="font-mono text-2xl font-black" style={{ color: timerColor, fontFamily: "'Bangers', cursive" }}>{minutes}:{seconds}</span>
          <button onClick={() => setTimerActive((t) => !t)} className="text-xs font-mono border-2 border-foreground px-2 py-0.5 hover:bg-muted">
            {timerActive ? "PAUSE" : "RESUME"}
          </button>
        </div>
        <div className="border-l-2 border-foreground/20 pl-6">
          <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">Combined: </span>
          <span className="font-black text-lg" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>{totalScore}/{maxScore}</span>
        </div>
      </div>

      {/* Panel score cards */}
      <div className="grid grid-cols-2 gap-4 max-w-2xl w-full mb-4">
        {CLUES.map((clue, i) => {
          const score = panelScores[i];
          const max = clue.questions.length;
          const passing = (score ?? 0) >= 3;
          const member = members.find((m) => m.panelIndex === i);
          const isMe = i === state.panelIndex;
          return (
            <div key={i} className="comic-panel bg-card overflow-hidden">
              <div className="border-b-2 border-foreground px-4 py-2 flex items-center justify-between" style={{ background: accentColors[i] }}>
                <span className="text-sm font-black tracking-wide text-white">
                  {clue.icon} {member?.studentName ?? `Panel ${i + 1}`}
                  {isMe && <span className="ml-1 text-white/70 text-xs">(you)</span>}
                </span>
                <span className="text-xs font-mono text-white/80">{clue.date}</span>
              </div>
              <div className="p-3">
                <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">{clue.loc}</p>
                <button
                  onClick={() => setRevealed((r) => r.map((v, idx) => (idx === i ? !v : v)))}
                  className="w-full text-left border-2 px-3 py-2 font-mono text-sm transition-all"
                  style={revealed[i]
                    ? { borderColor: accentColors[i], background: accentBg[i], color: "hsl(0 0% 10%)" }
                    : { borderColor: "hsl(0 0% 80%)", background: "hsl(0 0% 98%)", color: "hsl(0 0% 50%)" }}
                >
                  {revealed[i] ? (
                    <div className="flex items-center justify-between">
                      <span>Score: <strong>{score ?? "?"}/{max}</strong></span>
                      <span className="font-black" style={{ color: passing ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)" }}>
                        {passing ? "✓ PASSED" : "✗ PARTIAL"}
                      </span>
                    </div>
                  ) : (
                    <span className="tracking-widest">[ CLICK TO REVEAL SCORE ]</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Discussion guide */}
      <div className="comic-panel-cyan bg-card max-w-2xl w-full p-4 mb-4">
        <p className="text-xs font-mono font-black tracking-widest uppercase mb-3" style={{ color: "hsl(210 80% 40%)" }}>▶ Discuss — Connect the Evidence:</p>
        <div className="space-y-1">
          {[
            `🍽️ ${members.find(m => m.panelIndex === 0)?.studentName ?? "Det. 1"} — How did Maya hide her pain at home?`,
            `🎨 ${members.find(m => m.panelIndex === 1)?.studentName ?? "Det. 2"} — What clue showed the bullying reached school?`,
            `🌊 ${members.find(m => m.panelIndex === 2)?.studentName ?? "Det. 3"} — How did bullying invade her relationship?`,
            `⚡ ${members.find(m => m.panelIndex === 3)?.studentName ?? "Det. 4"} — What was the final breaking point?`,
          ].map((item, i) => (
            <p key={i} className="text-xs font-mono text-muted-foreground bg-muted px-3 py-1.5 border border-foreground/10">{item}</p>
          ))}
        </div>
      </div>

      {/* Verdict */}
      <div className="comic-panel bg-card max-w-2xl w-full p-5">
        <h3 className="font-black tracking-widest mb-1 uppercase text-lg" style={{ color: "hsl(354 78% 44%)" }}>Final Case Report</h3>
        <p className="text-muted-foreground font-mono text-xs mb-3">
          Any squad member can write and submit the verdict. What was the primary cause of Maya's situation?
        </p>
        <textarea
          className="comic-input resize-none mb-3"
          style={{ minHeight: "90px" }}
          placeholder="e.g. Maya was a victim of cyberbullying through a 'Burn Page' that spread into every part of her life..."
          value={verdict}
          onChange={(e) => setVerdict(e.target.value)}
          maxLength={400}
        />
        {error && <p className="font-mono text-sm mb-3" style={{ color: "hsl(354 78% 44%)" }}>✗ {error}</p>}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-0.5 hover:translate-y-0.5 transition-all duration-100 active:scale-95 disabled:opacity-60"
          style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0 hsl(354 78% 28%)" }}
        >
          {loading ? "SUBMITTING..." : "SUBMIT CASE REPORT →"}
        </button>
      </div>
    </div>
  );
}
