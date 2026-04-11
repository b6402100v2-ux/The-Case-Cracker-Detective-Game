import { createContext, useContext, useState, ReactNode } from "react";
import type { GameState } from "./types";
import { CLUES } from "./types";

interface GameContextValue {
  state: GameState;
  goToSetup: () => void;
  setSquadName: (name: string) => void;
  setDetective: (index: number, name: string) => void;
  startGame: () => void;
  submitPanelAnswer: (answer: string) => boolean;
  nextPanel: () => void;
  setFinalVerdict: (verdict: string) => void;
  submitVerdict: () => void;
  resetGame: () => void;
}

const initialState: GameState = {
  phase: "title",
  squadName: "",
  detectives: [
    { name: "", index: 0 },
    { name: "", index: 1 },
    { name: "", index: 2 },
    { name: "", index: 3 },
  ],
  currentPanel: 0,
  panelAnswers: ["", "", "", ""],
  panelCorrect: [false, false, false, false],
  collaborationAnswer: "",
  finalVerdict: "",
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const goToSetup = () => {
    setState((s) => ({ ...s, phase: "setup" }));
  };

  const setSquadName = (name: string) => {
    setState((s) => ({ ...s, squadName: name }));
  };

  const setDetective = (index: number, name: string) => {
    setState((s) => {
      const detectives = [...s.detectives];
      detectives[index] = { ...detectives[index], name };
      return { ...s, detectives };
    });
  };

  const startGame = () => {
    setState((s) => ({ ...s, phase: "individual", currentPanel: 0 }));
  };

  const submitPanelAnswer = (answer: string): boolean => {
    const clue = CLUES[state.currentPanel];
    const correct =
      answer.toLowerCase().trim().includes(clue.ans.toLowerCase());
    const panelAnswers = [...state.panelAnswers];
    const panelCorrect = [...state.panelCorrect];
    panelAnswers[state.currentPanel] = answer;
    panelCorrect[state.currentPanel] = correct;
    setState((s) => ({ ...s, panelAnswers, panelCorrect }));
    return correct;
  };

  const nextPanel = () => {
    setState((s) => {
      if (s.currentPanel >= 3) {
        return { ...s, phase: "collaboration" };
      }
      return { ...s, currentPanel: s.currentPanel + 1 };
    });
  };

  const setFinalVerdict = (verdict: string) => {
    setState((s) => ({ ...s, finalVerdict: verdict }));
  };

  const submitVerdict = () => {
    setState((s) => ({ ...s, phase: "ending" }));
  };

  const resetGame = () => {
    setState(initialState);
  };

  return (
    <GameContext.Provider
      value={{
        state,
        goToSetup,
        setSquadName,
        setDetective,
        startGame,
        submitPanelAnswer,
        nextPanel,
        setFinalVerdict,
        submitVerdict,
        resetGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
