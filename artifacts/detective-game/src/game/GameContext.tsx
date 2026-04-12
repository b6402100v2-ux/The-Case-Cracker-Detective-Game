import { createContext, useContext, useState, ReactNode } from "react";
import type { GamePhase } from "./types";
import { CLUES } from "./types";

export interface RoomStatus {
  memberCount: number;
  members: { studentName: string; panelIndex: number; submitted: boolean; hasBadge: boolean }[];
  allJoined: boolean;
  allSubmitted: boolean;
  panelScores: (number | null)[];
  panelBadges: boolean[];
  verdict: string | null;
}

interface GameState {
  phase: GamePhase;
  roomId: string;
  panelIndex: number;
  studentName: string;
  codeName: string;
  icon: string;
  panelSelections: (("A" | "B" | "C") | null)[];
  score: number;
  hasBadge: boolean;
}

interface GameContextValue {
  state: GameState;
  goToJoin: () => void;
  checkAvailability: (codeName: string, icon: string) => Promise<{ takenPanels: number[] } | null>;
  joinRoom: (codeName: string, icon: string, studentName: string, panelIndex: number) => Promise<string | null>;
  setPhase: (phase: GamePhase) => void;
  selectAnswer: (questionIndex: number, key: "A" | "B" | "C") => void;
  submitPanel: (score: number, hasBadge: boolean) => Promise<void>;
  submitVerdict: (verdict: string) => Promise<void>;
  fetchRoomStatus: () => Promise<RoomStatus | null>;
  resetGame: () => void;
}

const initialState: GameState = {
  phase: "title",
  roomId: "",
  panelIndex: 0,
  studentName: "",
  codeName: "",
  icon: "",
  panelSelections: CLUES[0].questions.map(() => null),
  score: 0,
  hasBadge: false,
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<GameState>(initialState);

  const goToJoin = () => setState((s) => ({ ...s, phase: "join" }));
  const setPhase = (phase: GamePhase) => setState((s) => ({ ...s, phase }));

  const checkAvailability = async (codeName: string, icon: string) => {
    try {
      const res = await fetch(
        `/api/rooms/availability?codeName=${encodeURIComponent(codeName)}&icon=${encodeURIComponent(icon)}`
      );
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const joinRoom = async (codeName: string, icon: string, studentName: string, panelIndex: number): Promise<string | null> => {
    const res = await fetch("/api/rooms/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codeName, icon, studentName, panelIndex }),
    });
    const data = await res.json();
    if (!res.ok) return data.error ?? "Failed to join room";
    const { roomId } = data as { roomId: string };
    setState((s) => ({
      ...s,
      roomId,
      panelIndex,
      studentName,
      codeName,
      icon,
      panelSelections: CLUES[panelIndex].questions.map(() => null),
      phase: "waiting_join",
    }));
    return null;
  };

  const selectAnswer = (questionIndex: number, key: "A" | "B" | "C") => {
    setState((s) => {
      const panelSelections = [...s.panelSelections];
      panelSelections[questionIndex] = key;
      return { ...s, panelSelections };
    });
  };

  const submitPanel = async (score: number, hasBadge: boolean) => {
    await fetch(`/api/rooms/${encodeURIComponent(state.roomId)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ panelIndex: state.panelIndex, score, answers: state.panelSelections, hasBadge }),
    });
    setState((s) => ({ ...s, score, hasBadge, phase: "waiting_submit" }));
  };

  const submitVerdict = async (verdict: string) => {
    await fetch(`/api/rooms/${encodeURIComponent(state.roomId)}/verdict`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ verdict }),
    });
    setState((s) => ({ ...s, phase: "ending" }));
  };

  const fetchRoomStatus = async (): Promise<RoomStatus | null> => {
    try {
      const res = await fetch(`/api/rooms/${encodeURIComponent(state.roomId)}/status`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  };

  const resetGame = () => setState(initialState);

  return (
    <GameContext.Provider value={{ state, goToJoin, checkAvailability, joinRoom, setPhase, selectAnswer, submitPanel, submitVerdict, fetchRoomStatus, resetGame }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
