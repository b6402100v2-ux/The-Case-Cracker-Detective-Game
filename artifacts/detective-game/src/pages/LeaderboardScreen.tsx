import { useState, useEffect } from "react";
import { CLUES } from "@/game/types";

interface LeaderMember {
  studentName: string;
  panelIndex: number;
  score: number | null;
  hasBadge: boolean;
}

interface LeaderRoom {
  roomId: string;
  codeName: string;
  icon: string;
  memberCount: number;
  members: LeaderMember[];
  allJoined: boolean;
  allSubmitted: boolean;
  panelScores: (number | null)[];
  panelBadges: boolean[];
  individualBadgeCount: number;
  assemblyMemberCount: number;
  allInAssembly: boolean;
  voteRoundNumber: number;
  voteComplete: boolean;
  voteCorrect: boolean | null;
  agreedKey: string | null;
  teamBadgesEarned: number;
  totalBadges: number;
  createdAt: number;
}

function getRating(total: number) {
  if (total >= 7) return { label: "🏆 GREAT DETECTIVES", color: "hsl(48 100% 40%)", bg: "hsl(48 100% 92%)" };
  if (total >= 4) return { label: "🥈 GOOD INVESTIGATORS", color: "hsl(210 80% 40%)", bg: "hsl(210 80% 95%)" };
  if (total >= 1) return { label: "🥉 FIELD AGENTS", color: "hsl(354 78% 44%)", bg: "hsl(354 78% 96%)" };
  return { label: "🔰 ROOKIE SQUAD", color: "hsl(0 0% 50%)", bg: "hsl(0 0% 95%)" };
}

function getPhaseLabel(room: LeaderRoom) {
  if (!room.allJoined) return { label: `Joining (${room.memberCount}/4)`, color: "hsl(0 0% 55%)" };
  if (!room.allSubmitted) return { label: "Investigating panels", color: "hsl(210 80% 40%)" };
  if (!room.allInAssembly) return { label: `Assembly (${room.assemblyMemberCount}/4)`, color: "hsl(48 100% 40%)" };
  if (!room.voteComplete) return { label: `Voting — Round ${room.voteRoundNumber}`, color: "hsl(354 78% 44%)" };
  return { label: room.voteCorrect ? "✓ Case Solved!" : "✗ Verdict Missed", color: room.voteCorrect ? "hsl(210 80% 40%)" : "hsl(354 78% 44%)" };
}

interface Props { onBack: () => void; }

export default function LeaderboardScreen({ onBack }: Props) {
  const [rooms, setRooms] = useState<LeaderRoom[]>([]);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/leaderboard");
      const data = await res.json();
      setRooms(data.rooms ?? []);
      setLastRefresh(new Date());
    } catch { /* silent */ }
    setLoading(false);
  };

  const handleDelete = async (roomId: string) => {
    setDeleting(roomId);
    try {
      await fetch(`/api/rooms/${encodeURIComponent(roomId)}`, { method: "DELETE" });
      setRooms((prev) => prev.filter((r) => r.roomId !== roomId));
    } catch { /* silent */ }
    setDeleting(null);
    setConfirmDelete(null);
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-5 px-4">
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      {/* Header */}
      <div className="mt-6 mb-4 max-w-3xl w-full flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black tracking-widest" style={{ color: "hsl(210 80% 40%)", textShadow: "3px 3px 0 hsl(210 80% 25%)", fontFamily: "'Bangers', cursive" }}>
            TEACHER DASHBOARD
          </h2>
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mt-0.5">
            Case #101 — All Squads · Auto-refresh every 5s
          </p>
        </div>
        <div className="text-right">
          <button
            onClick={onBack}
            className="border-4 border-foreground px-4 py-2 font-black tracking-widest text-sm uppercase hover:bg-muted transition-colors"
            style={{ fontFamily: "'Bangers', cursive" }}
          >
            ← BACK
          </button>
          <p className="font-mono text-xs text-muted-foreground mt-1">
            {lastRefresh.toLocaleTimeString()}
          </p>
        </div>
      </div>

      <div className="max-w-3xl w-full space-y-4">
        {/* Summary bar */}
        <div className="comic-panel bg-card px-5 py-3 flex items-center gap-6 flex-wrap">
          <div className="text-center">
            <p className="font-black text-2xl" style={{ color: "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>{rooms.length}</p>
            <p className="font-mono text-xs text-muted-foreground">Total squads</p>
          </div>
          <div className="text-center">
            <p className="font-black text-2xl" style={{ color: "hsl(210 80% 40%)", fontFamily: "'Bangers', cursive" }}>{rooms.filter(r => r.voteCorrect).length}</p>
            <p className="font-mono text-xs text-muted-foreground">Solved case</p>
          </div>
          <div className="text-center">
            <p className="font-black text-2xl" style={{ color: "hsl(48 100% 40%)", fontFamily: "'Bangers', cursive" }}>{rooms.filter(r => r.totalBadges >= 7).length}</p>
            <p className="font-mono text-xs text-muted-foreground">Great Detectives</p>
          </div>
          <div className="text-center">
            <p className="font-black text-2xl" style={{ color: "hsl(354 78% 44%)", fontFamily: "'Bangers', cursive" }}>{rooms.reduce((s, r) => s + r.memberCount, 0)}</p>
            <p className="font-mono text-xs text-muted-foreground">Total students</p>
          </div>
          <button
            onClick={fetchData}
            className="ml-auto border-2 border-foreground px-3 py-1 font-mono text-xs uppercase hover:bg-muted"
          >
            ↻ REFRESH
          </button>
        </div>

        {loading ? (
          <div className="text-center font-mono text-muted-foreground py-12 animate-pulse">Loading squads...</div>
        ) : rooms.length === 0 ? (
          <div className="comic-panel bg-card p-8 text-center">
            <p className="font-black text-xl" style={{ fontFamily: "'Bangers', cursive", color: "hsl(0 0% 50%)" }}>No squads have joined yet</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">Waiting for students to begin the investigation...</p>
          </div>
        ) : (
          rooms.map((room, rank) => {
            const rating = getRating(room.totalBadges);
            const phase = getPhaseLabel(room);
            return (
              <div key={room.roomId} className="comic-panel bg-card overflow-hidden">
                {/* Squad header */}
                <div className="border-b-4 border-foreground px-5 py-3 flex items-center justify-between flex-wrap gap-2"
                  style={{ background: rank === 0 && room.totalBadges > 0 ? "hsl(48 100% 50%)" : "hsl(210 80% 40%)" }}>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black text-white" style={{ fontFamily: "'Bangers', cursive" }}>#{rank + 1}</span>
                    <span className="text-xl">{room.icon}</span>
                    <div>
                      <p className="font-black text-lg text-white tracking-widest leading-none" style={{ fontFamily: "'Bangers', cursive" }}>{room.codeName}</p>
                      <p className="font-mono text-xs text-white/80">{room.memberCount}/4 detectives</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="text-right">
                      <div className="border border-white/40 px-2 py-0.5 font-mono text-xs text-white">
                        {phase.label}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-2xl text-white" style={{ fontFamily: "'Bangers', cursive" }}>
                        {room.totalBadges} 🏆
                      </p>
                      <div className="inline-block px-2 py-0.5 text-xs font-black" style={{ background: rating.bg, color: rating.color }}>
                        {rating.label}
                      </div>
                    </div>

                    {/* Delete button */}
                    {confirmDelete === room.roomId ? (
                      <div className="flex gap-1 items-center ml-1">
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="border border-white/50 text-white px-2 py-1 text-xs font-mono font-black uppercase hover:bg-white/20"
                        >
                          CANCEL
                        </button>
                        <button
                          onClick={() => handleDelete(room.roomId)}
                          disabled={deleting === room.roomId}
                          className="bg-black/70 text-white px-2 py-1 text-xs font-mono font-black uppercase hover:bg-black"
                        >
                          {deleting === room.roomId ? "..." : "DELETE"}
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(room.roomId)}
                        className="border border-white/40 text-white/70 px-2 py-1 text-xs font-mono uppercase hover:text-white hover:border-white/80 hover:bg-black/30 transition-all ml-1"
                        title="Delete this squad"
                      >
                        🗑
                      </button>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  {/* Panel breakdown */}
                  <div>
                    <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground font-black mb-2">Investigation Panels:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {CLUES.map((clue, i) => {
                        const member = room.members.find((m) => m.panelIndex === i);
                        const score = room.panelScores[i] ?? null;
                        const hasBadge = room.panelBadges[i] ?? false;
                        const accentColors = ["hsl(354 78% 44%)", "hsl(210 80% 40%)", "hsl(48 100% 40%)", "hsl(354 78% 44%)"];
                        const accentBgs = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"];
                        return (
                          <div key={i} className="border-2 p-2.5"
                            style={hasBadge
                              ? { borderColor: "hsl(48 100% 40%)", background: "hsl(48 100% 92%)" }
                              : member ? { borderColor: accentColors[i], background: accentBgs[i] }
                              : { borderColor: "hsl(0 0% 82%)", background: "hsl(0 0% 98%)" }}>
                            <p className="text-sm">{clue.icon}</p>
                            <p className="font-mono text-xs text-muted-foreground truncate">
                              {member?.studentName ?? <span className="opacity-50">empty</span>}
                            </p>
                            <p className="font-black text-sm" style={{ color: hasBadge ? "hsl(48 85% 28%)" : accentColors[i], fontFamily: "'Bangers', cursive" }}>
                              {score !== null ? `${score}/5` : "—"} {hasBadge ? "🏆" : ""}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Verdict result */}
                  {(room.voteComplete || room.allInAssembly) && (
                    <div className="border-2 px-4 py-2 flex items-center justify-between"
                      style={room.voteCorrect
                        ? { borderColor: "hsl(210 80% 40%)", background: "hsl(210 80% 95%)" }
                        : room.voteComplete
                        ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)" }
                        : { borderColor: "hsl(0 0% 80%)", background: "hsl(0 0% 97%)" }}>
                      <div>
                        <p className="font-mono text-xs font-black uppercase tracking-widest"
                          style={{ color: room.voteCorrect ? "hsl(210 80% 40%)" : room.voteComplete ? "hsl(354 78% 44%)" : "hsl(0 0% 55%)" }}>
                          Team Verdict
                        </p>
                        <p className="font-mono text-xs text-muted-foreground">
                          {room.voteComplete
                            ? room.voteCorrect ? `Correct — Round ${room.voteRoundNumber}` : "Missed both rounds"
                            : room.allInAssembly ? `Voting — Round ${room.voteRoundNumber}` : "Not yet"}
                        </p>
                      </div>
                      <p className="font-black text-lg" style={{ fontFamily: "'Bangers', cursive", color: room.voteCorrect ? "hsl(48 100% 40%)" : "hsl(0 0% 55%)" }}>
                        +{room.teamBadgesEarned} 🏆
                      </p>
                    </div>
                  )}

                  {/* Badge total */}
                  <div className="flex items-center justify-between border-t-2 pt-3" style={{ borderColor: "hsl(0 0% 88%)" }}>
                    <div className="flex gap-1">
                      {room.individualBadgeCount > 0 && (
                        <span className="font-mono text-xs text-muted-foreground">{room.individualBadgeCount} panel {room.individualBadgeCount === 1 ? "badge" : "badges"}</span>
                      )}
                      {room.individualBadgeCount > 0 && room.teamBadgesEarned > 0 && <span className="font-mono text-xs text-muted-foreground"> + </span>}
                      {room.teamBadgesEarned > 0 && (
                        <span className="font-mono text-xs text-muted-foreground">{room.teamBadgesEarned} verdict {room.teamBadgesEarned === 1 ? "badge" : "badges"}</span>
                      )}
                    </div>
                    <div className="font-black text-base" style={{ color: rating.color, fontFamily: "'Bangers', cursive" }}>
                      TOTAL: {room.totalBadges}/9 {rating.label.split(" ").slice(1).join(" ")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="max-w-3xl w-full mt-4 mb-8">
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
