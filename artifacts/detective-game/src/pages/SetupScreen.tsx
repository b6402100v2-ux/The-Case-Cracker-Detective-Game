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

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center justify-center p-4">
      <div className="comic-panel bg-card max-w-xl w-full overflow-hidden">
        {/* Header */}
        <div className="bg-secondary px-6 py-4 border-b-4 border-foreground">
          <h2 className="text-3xl font-black text-center text-secondary-foreground tracking-widest">
            ASSEMBLE YOUR SQUAD
          </h2>
        </div>

        <div className="p-6 space-y-6">
          {/* Squad name */}
          <div>
            <label className="block text-primary text-lg font-bold tracking-widest mb-2 uppercase">
              Squad Name
            </label>
            <input
              className="comic-input uppercase"
              placeholder="e.g. THE SHADOW HAWKS"
              value={state.squadName}
              onChange={(e) => setSquadName(e.target.value.toUpperCase())}
              maxLength={30}
            />
          </div>

          {/* Divider */}
          <div className="border-t-2 border-dashed border-foreground/30" />

          {/* Detective names */}
          <div>
            <p className="text-accent text-sm font-mono tracking-widest mb-4 uppercase">
              ▶ Each detective investigates ONE location
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Maya's Bedroom", color: "text-secondary", icon: "📓" },
                { label: "School Hallway", color: "text-accent", icon: "🔒" },
                { label: "Computer Lab", color: "text-primary", icon: "💻" },
                { label: "Cafeteria", color: "text-secondary", icon: "💬" },
              ].map((loc, i) => (
                <div key={i} className="space-y-1">
                  <label className={`text-xs font-mono font-bold ${loc.color} tracking-widest uppercase`}>
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
            <div className="bg-destructive/20 border-2 border-destructive p-3">
              {errors.map((err, i) => (
                <p key={i} className="text-destructive text-sm font-mono">
                  ✗ {err}
                </p>
              ))}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="comic-panel w-full bg-primary text-primary-foreground py-4 text-xl font-black tracking-widest uppercase hover:translate-x-1 hover:translate-y-1 transition-all duration-100 active:scale-95"
            style={{ boxShadow: "5px 5px 0px hsl(45 100% 30%)" }}
          >
            FRACTURE THE PANELS →
          </button>
        </div>
      </div>
    </div>
  );
}
