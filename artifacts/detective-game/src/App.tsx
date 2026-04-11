import { GameProvider, useGame } from "@/game/GameContext";
import TitleScreen from "@/pages/TitleScreen";
import SetupScreen from "@/pages/SetupScreen";
import IndividualPanel from "@/pages/IndividualPanel";
import CollaborationScreen from "@/pages/CollaborationScreen";
import EndingScreen from "@/pages/EndingScreen";

function GameRouter() {
  const { state, goToSetup } = useGame();

  switch (state.phase) {
    case "title":
      return <TitleScreen onStart={goToSetup} />;
    case "setup":
      return <SetupScreen />;
    case "individual":
      return <IndividualPanel />;
    case "collaboration":
      return <CollaborationScreen />;
    case "ending":
      return <EndingScreen />;
    default:
      return <TitleScreen onStart={goToSetup} />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
