import { createContext, useContext, useState, ReactNode } from "react";
import type { GameState } from "./types";
import { CLUES } from "./types";

interface GameContextValue {
  state: GameState;
  goToSetup: () => void;
  setSquadName: (name: string) => void;
  setDetective: (index: number, name: string) => void;
  startGame: () => void;
  selectAnswer: (panelIndex: number, questionIndex: number, key: "A" | "B" | "C") => void;
  submitPanel: () => void;
  setFinalVerdict: (verdict: string) => void;
  submitVerdict: () => void;
  resetGame: () => void;
}

const makeEmptySelections = () =>
  CLUES.map((c) => c.questions.map(() => null as ("A" | "B" | "C") | null));

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
  panelSelections: makeEmptySelections(),
  panelScores: [0, 0, 0, 0],
  finalVerdict: "",
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const goToSetup = () => setState((s) => ({ ...s, phase: "setup" }));

  const setSquadName = (name: string) => setState((s) => ({ ...s, squadName: name }));

  const setDetective = (index: number, name: string) =>
    setState((s) => {
      const detectives = [...s.detectives];
      detectives[index] = { ...detectives[index], name };
      return { ...s, detectives };
    });

  const startGame = () =>
    setState((s) => ({ ...s, phase: "individual", currentPanel: 0 }));

  const selectAnswer = (panelIndex: number, questionIndex: number, key: "A" | "B" | "C") => {
    setState((s) => {
      const panelSelections = s.panelSelections.map((p) => [...p]);
      panelSelections[panelIndex] = [...panelSelections[panelIndex]];
      panelSelections[panelIndex][questionIndex] = key;
      return { ...s, panelSelections };
    });
  };

  const submitPanel = () => {
    setState((s) => {
      const clue = CLUES[s.currentPanel];
      const selections = s.panelSelections[s.currentPanel];
      const score = clue.questions.reduce((acc, q, i) => {
        return acc + (selections[i] === q.ans ? 1 : 0);
      }, 0);
      const panelScores = [...s.panelScores];
      panelScores[s.currentPanel] = score;
      const nextPanel = s.currentPanel + 1;
      if (nextPanel >= CLUES.length) {
        return { ...s, panelScores, phase: "collaboration" };
      }
      return { ...s, panelScores, currentPanel: nextPanel };
    });
  };

  const setFinalVerdict = (verdict: string) =>
    setState((s) => ({ ...s, finalVerdict: verdict }));

  const submitVerdict = () => setState((s) => ({ ...s, phase: "ending" }));

  const resetGame = () => setState(initialState);

  return (
    <GameContext.Provider
      value={{
        state,
        goToSetup,
        setSquadName,
        setDetective,
        startGame,
        selectAnswer,
        submitPanel,
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
