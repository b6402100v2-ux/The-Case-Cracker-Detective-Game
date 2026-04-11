export type GamePhase =
  | "title"
  | "setup"
  | "individual"
  | "collaboration"
  | "verdict"
  | "ending";

export interface Detective {
  name: string;
  index: number;
}

export interface Clue {
  loc: string;
  locLabel: string;
  skill: string;
  text: string;
  q: string;
  ans: string;
  sfx: string;
  sfxColor: string;
  sfxTextColor: string;
  panelColor: string;
  icon: string;
}

export interface GameState {
  phase: GamePhase;
  squadName: string;
  detectives: Detective[];
  currentPanel: number;
  panelAnswers: string[];
  panelCorrect: boolean[];
  collaborationAnswer: string;
  finalVerdict: string;
}

export const CLUES: Clue[] = [
  {
    loc: "MAYA'S BEDROOM",
    locLabel: "The Diary",
    skill: "SKIMMING & SCANNING",
    text: "SEPT 5: New phone! Finally.\nSEPT 12: Someone started a thread on 'WHISPER'. I'm at the bottom.\nSEPT 15: The comments on my photo are getting mean. Why my glasses?",
    q: "On what EXACT DATE was the 'Whisper' app first mentioned?",
    ans: "sept 12",
    sfx: "THWACK!",
    sfxColor: "hsl(354 78% 44%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-pink",
    icon: "📓",
  },
  {
    loc: "SCHOOL HALLWAY",
    locLabel: "Locker 402",
    skill: "REFERENCE WORDS",
    text: "NOTE: 'You think you can just ignore IT? THEY are talking about \nTHIS in every group chat. Delete your account before IT gets worse.'",
    q: "In the text, who does the word 'THEY' refer to?",
    ans: "classmates",
    sfx: "KRA-KOOOM!",
    sfxColor: "hsl(210 80% 40%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-cyan",
    icon: "🔒",
  },
  {
    loc: "COMPUTER LAB",
    locLabel: "Browser History",
    skill: "MAIN IDEA IDENTIFICATION",
    text: "• Search: 'How to block anonymous users'\n• Search: 'Can police track Whisper app?'\n• Article: 'The Weight of Pixels: Why digital hate hurts.'",
    q: "What is the ONE main topic connecting all these searches?",
    ans: "cyberbullying",
    sfx: "CLICK!",
    sfxColor: "hsl(48 100% 50%)",
    sfxTextColor: "hsl(0 0% 10%)",
    panelColor: "comic-panel-yellow",
    icon: "💻",
  },
  {
    loc: "THE CAFETERIA",
    locLabel: "Leaked Chat",
    skill: "TONE & INFERENCE",
    text: "User02: 'Did she cry? Good. Maybe she'll get the hint she \ndoesn't belong here.'\nUser88: 'Is this too far?'\nUser02: 'No. It's just a joke. Don't be a snitch.'",
    q: "Based on the dialogue, what is User02's TONE?",
    ans: "hostile",
    sfx: "SHATTER!",
    sfxColor: "hsl(354 78% 44%)",
    sfxTextColor: "white",
    panelColor: "comic-panel-pink",
    icon: "💬",
  },
];
