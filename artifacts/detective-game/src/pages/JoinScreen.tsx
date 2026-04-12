import { useState } from "react";
import { useGame } from "@/game/GameContext";
import { TEAM_ICONS, CLUES } from "@/game/types";

const ICON_NAMES: Record<string, string> = {
  "🔍": "TRACKERS", "⚡": "BOLTS", "🎯": "SNIPERS", "🦊": "FOXES",
  "🐉": "DRAGONS", "🦁": "LIONS", "🌟": "STARS", "🔥": "FLAMES",
};

const RED = "hsl(354 78% 40%)";
const BLUE = "hsl(210 80% 35%)";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-black text-base uppercase tracking-wide mb-0.5" style={{ color: RED, fontFamily: "'Bangers', cursive", fontSize: "1.05rem" }}>
      {children}
    </p>
  );
}

function FieldDesc({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs italic mb-2" style={{ color: "hsl(0 0% 28%)" }}>
      {children}
    </p>
  );
}

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

  const panelColors = [RED, BLUE, "hsl(48 85% 35%)", RED];
  const panelBg = ["hsl(354 78% 96%)", "hsl(210 80% 95%)", "hsl(48 100% 92%)", "hsl(354 78% 96%)"];

  const handleFindSquad = async () => {
    if (!codeName.trim()) { setError("Enter a squad code name."); return; }
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
          <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: RED }}>
            <p className="font-mono text-xs tracking-widest text-white/80 uppercase mb-0.5">The Case Crackers · Case #101</p>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              JOIN YOUR SQUAD
            </h2>
          </div>

          <div className="p-5 space-y-5">

            {/* Detective Name */}
            <div>
              <FieldLabel>Your Detective Name</FieldLabel>
              <FieldDesc>This is your unique alias on the case. Only you have this name.</FieldDesc>
              <input
                className="comic-input"
                placeholder="e.g. Detective Rivera"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleFindSquad()}
              />
            </div>

            {/* Squad Code Name */}
            <div>
              <FieldLabel>Squad Code Name</FieldLabel>
              <FieldDesc>Use the same squad name as your teammates to join the same session.</FieldDesc>
              <input
                className="comic-input"
                placeholder="e.g. ALPHA SQUAD"
                value={codeName}
                onChange={(e) => setCodeName(e.target.value)}
                maxLength={30}
                onKeyDown={(e) => e.key === "Enter" && handleFindSquad()}
              />
            </div>

            {/* Team Icon */}
            <div>
              <FieldLabel>Team Icon</FieldLabel>
              <FieldDesc>Pick the same icon as your teammates to be on the same team.</FieldDesc>
              <div className="grid grid-cols-4 gap-2">
                {TEAM_ICONS.map((ic) => {
                  const selected = icon === ic;
                  return (
                    <button
                      key={ic}
                      onClick={() => setIcon(ic)}
                      className="border-4 py-2.5 flex flex-col items-center gap-1 transition-all duration-100 hover:scale-105 active:scale-95"
                      style={selected
                        ? { borderColor: "hsl(0 0% 10%)", background: "hsl(0 0% 10%)", color: "white" }
                        : { borderColor: "hsl(0 0% 70%)", background: "white" }}
                    >
                      <span className="text-2xl leading-none">{ic}</span>
                      <span className="font-black text-[9px] tracking-widest uppercase" style={{ color: selected ? "white" : "hsl(0 0% 30%)", fontFamily: "'Bangers', cursive", fontSize: "0.6rem" }}>
                        {ICON_NAMES[ic] ?? ic}
                      </span>
                    </button>
                  );
                })}
              </div>
              {icon && (
                <p className="font-mono text-xs mt-2 font-bold" style={{ color: "hsl(0 0% 20%)" }}>
                  Selected: {icon} {ICON_NAMES[icon]} — every teammate must pick this same icon!
                </p>
              )}
            </div>

            {error && (
              <p className="font-mono text-sm font-bold border-l-4 pl-3 py-1" style={{ color: RED, borderColor: RED }}>
                ✗ {error}
              </p>
            )}

            <div>
              <button
                onClick={handleFindSquad}
                disabled={loading}
                className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-60"
                style={{ background: RED, boxShadow: "5px 5px 0 hsl(354 78% 25%)" }}
              >
                {loading ? "CHECKING..." : "FIND SQUAD →"}
              </button>
              <p className="font-mono text-xs italic text-center mt-1.5" style={{ color: "hsl(0 0% 38%)" }}>
                This connects you to your teammates and shows available panels.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="comic-panel bg-card max-w-xl w-full overflow-hidden">
          <div className="border-b-4 border-foreground px-5 py-3 text-center" style={{ background: BLUE }}>
            <p className="font-mono text-xs tracking-widest text-white/80 uppercase mb-0.5">
              Squad: {icon} {codeName.toUpperCase()} · Detective: {studentName}
            </p>
            <h2 className="text-3xl font-black text-white tracking-widest" style={{ fontFamily: "'Bangers', cursive" }}>
              CHOOSE YOUR FILE
            </h2>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <FieldLabel>Investigation Panel</FieldLabel>
              <FieldDesc>Each detective investigates a different diary. Pick one that hasn't been claimed yet by a teammate.</FieldDesc>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {CLUES.map((clue, i) => {
                const taken = takenPanels.includes(i);
                const selected = selectedPanel === i;
                return (
                  <button
                    key={i}
                    disabled={taken}
                    onClick={() => !taken && setSelectedPanel(i)}
                    className={`border-4 p-4 text-left transition-all duration-100 ${taken ? "opacity-40 cursor-not-allowed" : "hover:translate-x-0.5 cursor-pointer"}`}
                    style={
                      selected
                        ? { borderColor: panelColors[i], background: panelBg[i] }
                        : taken
                        ? { borderColor: "hsl(0 0% 75%)", background: "hsl(0 0% 96%)" }
                        : { borderColor: "hsl(0 0% 75%)", background: "white" }
                    }
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="border-2 border-foreground rounded-none px-2 py-1 text-2xl shrink-0"
                        style={{ background: taken ? "hsl(0 0% 88%)" : panelBg[i] }}
                      >
                        {clue.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-black text-base" style={{ color: taken ? "hsl(0 0% 50%)" : panelColors[i], fontFamily: "'Bangers', cursive" }}>
                            PANEL {i + 1}
                          </span>
                          {taken && (
                            <span className="font-mono text-xs border border-current px-1.5 py-0.5 font-black" style={{ color: "hsl(0 0% 50%)" }}>
                              CLAIMED
                            </span>
                          )}
                          {selected && !taken && (
                            <span className="font-mono text-xs border border-current px-1.5 py-0.5 font-black" style={{ color: panelColors[i] }}>
                              ✓ SELECTED
                            </span>
                          )}
                        </div>
                        <p className="font-black text-sm" style={{ color: "hsl(0 0% 10%)" }}>{clue.date}: {clue.loc}</p>
                        <p className="font-mono text-xs italic" style={{ color: "hsl(0 0% 35%)" }}>{clue.domain}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <p className="font-mono text-sm font-bold border-l-4 pl-3 py-1" style={{ color: RED, borderColor: RED }}>
                ✗ {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { setStep("info"); setError(""); }}
                className="border-4 border-foreground px-4 py-3 font-black tracking-widest text-sm hover:bg-muted transition-colors"
              >
                ← BACK
              </button>
              <div className="flex-1">
                <button
                  onClick={handleJoin}
                  disabled={loading || selectedPanel === null}
                  className="comic-panel w-full text-white py-3 text-lg font-black tracking-widest uppercase transition-all duration-100 hover:translate-x-0.5 hover:translate-y-0.5 active:scale-95 disabled:opacity-50"
                  style={{ background: RED, boxShadow: "4px 4px 0 hsl(354 78% 25%)" }}
                >
                  {loading ? "JOINING..." : selectedPanel !== null ? `CLAIM PANEL ${selectedPanel + 1} →` : "SELECT A FILE FIRST"}
                </button>
                <p className="font-mono text-xs italic text-center mt-1.5" style={{ color: "hsl(0 0% 38%)" }}>
                  {selectedPanel !== null
                    ? `You will investigate: ${CLUES[selectedPanel].date} — ${CLUES[selectedPanel].loc}`
                    : "Tap a panel above, then press this button to lock it in."}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
