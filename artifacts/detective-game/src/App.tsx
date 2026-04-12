import { useState } from "react";
import { GameProvider, useGame } from "@/game/GameContext";
import IntroScreen from "@/pages/IntroScreen";
import TitleScreen from "@/pages/TitleScreen";
import JoinScreen from "@/pages/JoinScreen";
import WaitingJoinScreen from "@/pages/WaitingJoinScreen";
import IndividualPanel from "@/pages/IndividualPanel";
import WaitingSubmitScreen from "@/pages/WaitingSubmitScreen";
import CollaborationScreen from "@/pages/CollaborationScreen";
import VerdictScreen from "@/pages/VerdictScreen";
import EndingScreen from "@/pages/EndingScreen";
import LeaderboardScreen from "@/pages/LeaderboardScreen";

function ExitButton() {
  const { state, resetGame } = useGame();
  const [confirming, setConfirming] = useState(false);
  if (state.phase === "intro" || state.phase === "title" || state.phase === "leaderboard") return null;
  return (
    <div className="fixed top-4 right-4 z-[100] flex items-center gap-2">
      {confirming ? (
        <>
          <button
            onClick={() => setConfirming(false)}
            className="border-2 border-foreground bg-white px-3 py-1 font-mono text-xs font-black uppercase hover:bg-muted transition-colors"
          >
            STAY
          </button>
          <button
            onClick={() => { setConfirming(false); resetGame(); }}
            className="border-2 border-white px-3 py-1 font-mono text-xs font-black uppercase text-white transition-colors"
            style={{ background: "hsl(354 78% 44%)" }}
          >
            LEAVE
          </button>
        </>
      ) : (
        <button
          onClick={() => setConfirming(true)}
          className="border-2 border-foreground bg-white/90 backdrop-blur-sm px-3 py-1 font-mono text-xs font-black uppercase hover:bg-muted transition-colors shadow-md"
          title="Exit game"
        >
          ✕ EXIT
        </button>
      )}
    </div>
  );
}

function GameRouter() {
  const { state, goToJoin, setPhase } = useGame();
  switch (state.phase) {
    case "intro":        return <IntroScreen onFinish={() => setPhase("title")} />;
    case "title":        return <TitleScreen onStart={goToJoin} onTeacherView={() => setPhase("leaderboard")} />;
    case "leaderboard":  return <LeaderboardScreen onBack={() => setPhase("title")} />;
    case "join":         return <JoinScreen />;
    case "waiting_join": return <WaitingJoinScreen />;
    case "individual":   return <IndividualPanel />;
    case "waiting_submit": return <WaitingSubmitScreen />;
    case "collaboration": return <CollaborationScreen />;
    case "verdict":      return <VerdictScreen />;
    case "ending":       return <EndingScreen />;
    default:             return <TitleScreen onStart={goToJoin} onTeacherView={() => setPhase("leaderboard")} />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <ExitButton />
      <GameRouter />
    </GameProvider>
  );
}
