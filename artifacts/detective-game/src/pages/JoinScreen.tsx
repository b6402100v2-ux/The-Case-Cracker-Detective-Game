import { useState } from "react";
import { useGame } from "@/game/GameContext";
import { TEAM_ICONS, CLUES } from "@/game/types";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

export default function JoinScreen() {
  const { checkAvailability, joinRoom } = useGame();

  const [step, setStep] = useState<"info" | "panel">("info");
  const [codeName, setCodeName] = useState("");
  const [icon, setIcon] = useState("");
  const [studentName, setStudentName] = useState("");
  const [takenPanels, setTakenPanels] = useState<number[]>([]);
  const [selectedPanel, setSelectedPanel] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const panelColors = [
    "hsl(354 78% 44%)",
    "hsl(210 80% 40%)",
    "hsl(48 100% 40%)",
    "hsl(354 78% 44%)",
  ];
  const panelBg = [
    "hsl(354 78% 96%)",
    "hsl(210 80% 95%)",
    "hsl(48 100% 92%)",
    "hsl(354 78% 96%)",
  ];

  const handleFindSquad = async () => {
    if (!codeName.trim()) { setError("Enter a team code name."); return; }
    if (!icon) { setError("Pick a team icon."); return; }
    if (!studentName.trim()) { setError("Enter your detective name."); return; }
    setError("");
    setLoading(true);
    const avail = await checkAvailability(codeName, icon);
    setLoading(false);
    if (!avail) { setError("Could not connect. Check your connection and try again."); return; }
    setTakenPanels(avail.takenPanels);
    setSelectedPanel(null);
    setStep("panel");
  };

  const handleJoin = async () => {
    if (selectedPanel === null) { setError("Choose an investigation file."); return; }
    setError("");
    setLoading(true);
    const err = await joinRoom(codeName, icon, studentName, selectedPanel);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      {TOP_BAR}

      {step === "info" ? (
        <div className="comic-panel bg-card max-w-md w-full overflow-hidden">
          <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(354 78% 44%)" }}>
            <p className="font-mono text-xs tracking-widest text-white/70 uppercase">Youth Detective Agency</p>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              JOIN YOUR SQUAD
            </h2>
          </div>

          <div className="p-5 space-y-5">
            <div className="border-2 border-foreground/20 bg-muted px-4 py-3 font-mono text-xs leading-relaxed text-muted-foreground">
              <p className="font-black text-foreground mb-1 uppercase tracking-widest text-xs">How it works:</p>
              <p>All squad members use the <strong>same code name + icon</strong>. Each detective chooses a different diary to investigate.</p>
            </div>

            <div>
              <label className="block font-mono text-xs font-black tracking-widest uppercase mb-1.5" style={{ color: "hsl(354 78% 44%)" }}>
                Team Code Name
              </label>
              <input
                className="comic-input"
                placeholder="e.g. ALPHA SQUAD"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleFindSquad()}
              />
            </div>

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
                  Selected: <strong>{icon}</strong> — every teammate must pick this same icon!
                </p>
              )}
            </div>

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
                onKeyDown={(e) => e.key === "Enter" && handleFindSquad()}
              />
            </div>

            {error && <p className="font-mono text-sm font-bold" style={{ color: "hsl(354 78% 44%)" }}>✗ {error}</p>}

            <button
              onClick={handleFindSquad}
              disabled={loading}
              className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-60"
              style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0 hsl(354 78% 28%)" }}
            >
              {loading ? "CHECKING..." : "FIND SQUAD →"}
            </button>
          </div>
        </div>
      ) : (
        <div className="comic-panel bg-card max-w-xl w-full overflow-hidden">
          <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: "hsl(210 80% 40%)" }}>
            <p className="font-mono text-xs tracking-widest text-white/70 uppercase">
              Squad: {icon} {codeName.toUpperCase()} · Detective: {studentName}
            </p>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              CHOOSE YOUR FILE
            </h2>
          </div>

          <div className="p-5 space-y-4">
            <p className="font-mono text-xs text-muted-foreground text-center tracking-widest uppercase">
              Select the diary entry you will investigate — each detective gets a different one
            </p>

            <div className="grid grid-cols-1 gap-3">
              {CLUES.map((clue, i) => {
                const taken = takenPanels.includes(i);
                const selected = selectedPanel === i;
                return (
                  <button
                    key={i}
                    disabled={taken}
                    onClick={() => !taken && setSelectedPanel(i)}
                    className={`border-4 p-4 text-left transition-all duration-100 ${taken ? "opacity-40 cursor-not-allowed" : "hover:translate-x-0.5 cursor-pointer"} ${selected ? "scale-[1.01]" : ""}`}
                    style={
                      selected
                        ? { borderColor: panelColors[i], background: panelBg[i] }
                        : taken
                        ? { borderColor: "hsl(0 0% 70%)", background: "hsl(0 0% 96%)" }
                        : { borderColor: "hsl(0 0% 80%)", background: "white" }
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="border-2 border-foreground rounded-none px-2 py-1 text-2xl shrink-0"
                        style={{ background: taken ? "hsl(0 0% 85%)" : panelBg[i] }}
                      >
                        {clue.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-black text-base" style={{ color: taken ? "hsl(0 0% 55%)" : panelColors[i], fontFamily: "'Bangers', cursive" }}>
                            PANEL {i + 1}
                          </span>
                          {taken && (
                            <span className="font-mono text-xs border border-current px-1.5 py-0.5" style={{ color: "hsl(0 0% 55%)" }}>
                              CLAIMED
                            </span>
                          )}
                          {selected && !taken && (
                            <span className="font-mono text-xs border border-current px-1.5 py-0.5 font-black" style={{ color: panelColors[i] }}>
                              ✓ SELECTED
                            </span>
                          )}
                        </div>
                        <p className="font-black text-sm text-foreground">{clue.date}: {clue.loc}</p>
                        <p className="font-mono text-xs text-muted-foreground">{clue.domain}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <p className="font-mono text-sm font-bold" style={{ color: "hsl(354 78% 44%)" }}>✗ {error}</p>}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("info"); setError(""); }}
                className="border-4 border-foreground px-4 py-3 font-black tracking-widest text-sm hover:bg-muted transition-colors"
              >
                ← BACK
              </button>
              <button
                onClick={handleJoin}
                disabled={loading || selectedPanel === null}
                className="comic-panel flex-1 text-white py-3 text-lg font-black tracking-widest uppercase transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-50"
                style={{ background: "hsl(354 78% 44%)", boxShadow: "4px 4px 0 hsl(354 78% 28%)" }}
              >
                {loading ? "JOINING..." : selectedPanel !== null ? `CLAIM PANEL ${selectedPanel + 1} →` : "SELECT A FILE FIRST"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
