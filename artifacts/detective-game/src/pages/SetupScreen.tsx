import { useState } from "react";
import { useGame } from "@/game/GameContext";

export default function SetupScreen() {
  const { state, setSquadName, setDetective, startGame } = useGame();
  const [errors, setErrors] = useState<string[]>([]);

  const handleSubmit = () => {
    const errs: string[] = [];
    if (!state.squadName.trim()) errs.push("Squad name is required");
    state.detectives.forEach((d, i) => {
      if (!d.name.trim()) errs.push(`Detective ${i + 1} name is required`);
    });
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }
    startGame();
  };

  const locations = [
    { label: "Maya's Bedroom", sub: "The Diary", color: "hsl(354 78% 44%)", icon: "📓" },
    { label: "School Hallway", sub: "Locker 402", color: "hsl(210 80% 40%)", icon: "🔒" },
    { label: "Computer Lab", sub: "Browser History", color: "hsl(48 100% 40%)", icon: "💻" },
    { label: "The Cafeteria", sub: "Leaked Chat", color: "hsl(354 78% 44%)", icon: "💬" },
  ];

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      {/* Top bar */}
      <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
        <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
        <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
        <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
      </div>

      <div className="comic-panel bg-card max-w-xl w-full overflow-hidden mt-4">
        {/* Header */}
        <div className="border-b-4 border-foreground px-6 py-4" style={{ background: "hsl(354 78% 44%)" }}>
          <h2 className="text-3xl font-black text-center text-white tracking-widest uppercase">
            ASSEMBLE YOUR SQUAD
          </h2>
        </div>

        <div className="p-6 space-y-5">
          {/* Squad name */}
          <div>
            <label className="block text-sm font-black tracking-widest mb-2 uppercase font-mono" style={{ color: "hsl(354 78% 44%)" }}>
              Squad Name
            </label>
            <input
              className="comic-input uppercase"
              placeholder="e.g. THE CIPHER SQUAD"
              value={state.squadName}
              onChange={(e) => setSquadName(e.target.value.toUpperCase())}
              maxLength={30}
            />
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-foreground/20" />

          {/* Detective names */}
          <div>
            <p className="text-xs font-mono font-black tracking-widest mb-4 uppercase" style={{ color: "hsl(210 80% 40%)" }}>
              ▶ Each detective investigates ONE location
            </p>
            <div className="grid grid-cols-2 gap-4">
              {locations.map((loc, i) => (
                <div key={i} className="space-y-1">
                  <label className="flex items-center gap-1 text-xs font-mono font-black tracking-widest uppercase" style={{ color: loc.color }}>
                    {loc.icon} Det. {i + 1} — {loc.label}
                  </label>
                  <input
                    className="comic-input text-sm"
                    placeholder={`Detective ${i + 1}...`}
                    value={state.detectives[i]?.name || ""}
                    onChange={(e) => setDetective(i, e.target.value)}
                    maxLength={25}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="border-2 p-3" style={{ borderColor: "hsl(354 78% 44%)", background: "hsl(354 78% 97%)" }}>
              {errors.map((err, i) => (
                <p key={i} className="text-sm font-mono" style={{ color: "hsl(354 78% 44%)" }}>
                  ✗ {err}
                </p>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="comic-panel w-full text-white py-4 text-xl font-black tracking-widest uppercase hover:translate-x-1 hover:translate-y-1 transition-all duration-100 active:scale-95"
            style={{ background: "hsl(354 78% 44%)", boxShadow: "5px 5px 0px hsl(354 78% 28%)" }}
          >
            FRACTURE THE PANELS →
          </button>
        </div>
      </div>
    </div>
  );
}
