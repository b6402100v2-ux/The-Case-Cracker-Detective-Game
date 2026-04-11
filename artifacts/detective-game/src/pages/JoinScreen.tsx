import { useState } from "react";
import { useGame } from "@/game/GameContext";
import { TEAM_ICONS } from "@/game/types";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

export default function JoinScreen() {
  const { joinRoom } = useGame();
  const [codeName, setCodeName] = useState("");
  const [icon, setIcon] = useState("");
  const [studentName, setStudentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    if (!codeName.trim()) { setError("Enter a team code name."); return; }
    if (!icon) { setError("Pick a team icon."); return; }
    if (!studentName.trim()) { setError("Enter your detective name."); return; }
    setError("");
    setLoading(true);
    const err = await joinRoom(codeName, icon, studentName);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      {TOP_BAR}
      <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
        <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(354 78% 44%)" }}>
          <p className="font-mono text-xs tracking-widest text-white/70 uppercase">Youth Detective Agency</p>
          <h2
            className="text-3xl font-black text-white tracking-widest"
            style={{ fontFamily: "'Bangers', cursive" }}
          >
            JOIN YOUR SQUAD
          </h2>
        </div>

        <div className="p-5 space-y-5">
          {/* Instructions */}
          <div className="border-2 border-foreground/20 bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
            <p className="font-black text-foreground mb-1 uppercase tracking-widest text-xs">How it works:</p>
            <p>All 4 detectives must use the <strong>same code name</strong> + <strong>same icon</strong> to join the same squad. Each detective gets a different diary entry to investigate.</p>
          </div>

          {/* Team code name */}
          <div>
            <label className="block font-mono text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "hsl(354 78% 44%)" }}>
              Team Code Name
            </label>
            <input
              className="comic-input"
              placeholder='e.g. ALPHA SQUAD'
              value={codeName}
              onChange={(e) => setCodeName(e.target.value)}
              maxLength={30}
              autoCapitalize="characters"
            />
          </div>

          {/* Team icon */}
          <div>
            <label className="block font-mono text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "hsl(354 78% 44%)" }}>
              Team Icon
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TEAM_ICONS.map((ic) => (
                <button
                  key={ic}
                  onClick={() => setIcon(ic)}
                  className="border-4 py-2 text-2xl text-center transition-all duration-100 hover:scale-110 active:scale-95"
                  style={
                    icon === ic
                      ? { borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 96%)" }
                      : { borderColor: "hsl(0 0% 80%)", background: "white" }
                  }
                >
                  {ic}
                </button>
              ))}
            </div>
            {icon && (
              <p className="font-mono text-xs text-muted-foreground mt-1.5 text-center">
                Selected: <strong>{icon}</strong> — your whole squad must pick this same icon!
              </p>
            )}
          </div>

          {/* Student name */}
          <div>
            <label className="block font-mono text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "hsl(354 78% 44%)" }}>
              Your Detective Name
            </label>
            <input
              className="comic-input"
              placeholder="e.g. Detective Rivera"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              maxLength={30}
            />
          </div>

          {error && (
            <p className="font-mono text-sm font-bold" style={{ color: "hsl(354 78% 44%)" }}>
              ✗ {error}
            </p>
          )}

          <button
            onClick={handleJoin}
            disabled={loading}
            className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-60"
            style={{
              background: "hsl(354 78% 44%)",
              boxShadow: "5px 5px 0 hsl(354 78% 28%)",
            }}
          >
            {loading ? "JOINING..." : "JOIN SQUAD →"}
          </button>
        </div>
      </div>
    </div>
  );
}
