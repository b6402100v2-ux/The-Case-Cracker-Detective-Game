import { useState } from "react";
import { useGame } from "@/game/GameContext";

const TOP_BAR = (
  <div className="fixed top-0 left-0 right-0 flex h-3 z-50">
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
    <div className="flex-1" style={{ background: "hsl(210 80% 40%)" }} />
    <div className="flex-1" style={{ background: "hsl(48 100% 50%)" }} />
    <div className="flex-1" style={{ background: "hsl(354 78% 44%)" }} />
  </div>
);

const CASES = [
  {
    number: "CASE #101",
    title: "THE SILENT NOTIFICATION",
    subtitle: "Last Chat Series · Vol. 3",
    strategy: "Main Idea Identification",
    strategyIcon: "🎯",
    description: "Maya's diary entries hold the truth. Four detectives must read between the lines to uncover the real cause of her silence.",
    icon: "📱",
    color: "hsl(354 78% 44%)",
    colorBg: "hsl(354 78% 96%)",
    colorDark: "hsl(354 78% 28%)",
    colorLight: "hsl(354 78% 96%)",
    available: true,
    badge: "PLAYABLE NOW",
    badgeBg: "hsl(210 80% 40%)",
  },
  {
    number: "CASE #102",
    title: "LAST CHAT: WHO KILLED ALEX?",
    subtitle: "Last Chat Series · Vol. 1",
    strategy: "Skimming & Scanning",
    strategyIcon: "⚡",
    description: "A group chat goes silent. Sift through messages, timestamps and digital breadcrumbs to find out what really happened to Alex.",
    icon: "💬",
    color: "hsl(210 80% 40%)",
    colorBg: "hsl(210 80% 95%)",
    colorDark: "hsl(210 80% 25%)",
    colorLight: "hsl(210 80% 95%)",
    available: false,
    badge: "COMING SOON",
    badgeBg: "hsl(0 0% 55%)",
  },
  {
    number: "CASE #103",
    title: "JUDAS MANOR: THE DIAMOND THIEF",
    subtitle: "Manor Mysteries · Vol. 1",
    strategy: "Making References",
    strategyIcon: "🔗",
    description: "A priceless diamond vanishes from the locked manor. Follow the references hidden in witness statements to expose the thief.",
    icon: "💎",
    color: "hsl(48 100% 40%)",
    colorBg: "hsl(48 100% 92%)",
    colorDark: "hsl(48 100% 25%)",
    colorLight: "hsl(48 100% 92%)",
    available: false,
    badge: "COMING SOON",
    badgeBg: "hsl(0 0% 55%)",
  },
];

export default function CaseSelectScreen() {
  const { goToJoin, setPhase } = useGame();
  const [hovered, setHovered] = useState<number | null>(null);
  const [comingSoonFlash, setComingSoonFlash] = useState<number | null>(null);

  const handleSelect = (idx: number) => {
    if (!CASES[idx].available) {
      setComingSoonFlash(idx);
      setTimeout(() => setComingSoonFlash(null), 1200);
      return;
    }
    goToJoin();
  };

  return (
    <div className="min-h-screen halftone-bg flex flex-col items-center py-6 px-4">
      {TOP_BAR}

      {/* Header */}
      <div className="mt-8 mb-6 text-center">
        <div className="sfx-burst text-sm inline-block mb-3 font-black" style={{ background: "hsl(354 78% 44%)", color: "white" }}>
          CASE FILES
        </div>
        <h1
          className="text-5xl font-black tracking-widest leading-none"
          style={{ color: "hsl(210 80% 40%)", textShadow: "4px 4px 0 hsl(210 80% 25%)", fontFamily: "'Bangers', cursive" }}
        >
          THE CASE CRACKERS
        </h1>
        <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mt-2">
          Select a case to investigate — choose wisely, detective.
        </p>
      </div>

      {/* Case cards */}
      <div className="max-w-2xl w-full space-y-4">
        {CASES.map((c, idx) => {
          const isHovered = hovered === idx;
          const isFlashing = comingSoonFlash === idx;
          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              onMouseEnter={() => setHovered(idx)}
              onMouseLeave={() => setHovered(null)}
              className="w-full text-left transition-all duration-100 comic-panel overflow-hidden"
              style={{
                transform: isHovered && c.available ? "translate(-2px, -2px)" : "none",
                boxShadow: isHovered && c.available ? `7px 7px 0 ${c.colorDark}` : undefined,
                opacity: !c.available ? 0.75 : 1,
                cursor: c.available ? "pointer" : "not-allowed",
              }}
            >
              {/* Case header band */}
              <div
                className="flex items-center justify-between px-5 py-2 border-b-4 border-foreground"
                style={{ background: isFlashing ? "hsl(354 78% 44%)" : c.color }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div>
                    <p className="font-mono text-xs text-white/70 tracking-widest uppercase">{c.number}</p>
                    <p
                      className="text-xl font-black text-white tracking-wide leading-none"
                      style={{ fontFamily: "'Bangers', cursive" }}
                    >
                      {c.title}
                    </p>
                  </div>
                </div>
                <div
                  className="font-mono text-xs font-black px-3 py-1 border-2 border-white/60 shrink-0"
                  style={{ background: isFlashing ? "white" : c.badgeBg, color: isFlashing ? "hsl(354 78% 44%)" : "white" }}
                >
                  {isFlashing ? "STAY TUNED!" : c.badge}
                </div>
              </div>

              {/* Case body */}
              <div className="px-5 py-4 flex gap-4 items-start bg-card">
                {/* Reading strategy pill */}
                <div className="shrink-0 mt-0.5">
                  <div
                    className="border-2 px-3 py-2 text-center"
                    style={{ borderColor: c.color, background: c.colorBg, minWidth: "90px" }}
                  >
                    <p className="text-lg">{c.strategyIcon}</p>
                    <p className="font-mono text-[9px] font-black tracking-widest uppercase leading-tight mt-0.5" style={{ color: c.color }}>
                      {c.strategy}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="flex-1">
                  <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest mb-1">{c.subtitle}</p>
                  <p className="font-mono text-sm text-foreground leading-relaxed">{c.description}</p>

                  {c.available ? (
                    <div
                      className="mt-3 inline-flex items-center gap-2 font-black text-sm tracking-widest uppercase"
                      style={{ color: c.color, fontFamily: "'Bangers', cursive" }}
                    >
                      ▶ ENTER CASE FILE →
                    </div>
                  ) : (
                    <div className="mt-3 font-mono text-xs text-muted-foreground tracking-widest uppercase">
                      🔒 Content coming soon
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Back link */}
      <button
        onClick={() => setPhase("title")}
        className="mt-8 font-mono text-xs text-muted-foreground hover:text-foreground tracking-widest uppercase underline underline-offset-4 transition-colors"
      >
        ← Back to title
      </button>
    </div>
  );
}
