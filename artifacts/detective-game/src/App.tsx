import { GameProvider, useGame } from "@/game/GameContext";
import TitleScreen from "@/pages/TitleScreen";
import JoinScreen from "@/pages/JoinScreen";
import WaitingJoinScreen from "@/pages/WaitingJoinScreen";
import IndividualPanel from "@/pages/IndividualPanel";
import WaitingSubmitScreen from "@/pages/WaitingSubmitScreen";
import CollaborationScreen from "@/pages/CollaborationScreen";
import EndingScreen from "@/pages/EndingScreen";

function GameRouter() {
  const { state, goToJoin } = useGame();

  switch (state.phase) {
    case "title":
      return <TitleScreen onStart={goToJoin} />;
    case "join":
      return <JoinScreen />;
    case "waiting_join":
      return <WaitingJoinScreen />;
    case "individual":
      return <IndividualPanel />;
    case "waiting_submit":
      return <WaitingSubmitScreen />;
    case "collaboration":
      return <CollaborationScreen />;
    case "ending":
      return <EndingScreen />;
    default:
      return <TitleScreen onStart={goToJoin} />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}
