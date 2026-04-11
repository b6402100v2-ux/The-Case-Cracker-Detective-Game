import { Router } from "express";

interface RoomMember {
  studentName: string;
  panelIndex: number;
  answers: (string | null)[];
  score: number | null;
}

interface Room {
  id: string;
  codeName: string;
  icon: string;
  members: RoomMember[];
  verdict: string | null;
  createdAt: number;
}

const rooms = new Map<string, Room>();

function roomKey(codeName: string, icon: string): string {
  return `${codeName.trim().toUpperCase()}::${icon}`;
}

const router = Router();

router.post("/rooms/join", (req, res) => {
  const { codeName, icon, studentName } = req.body as {
    codeName?: string;
    icon?: string;
    studentName?: string;
  };
  if (!codeName || !icon || !studentName) {
    res.status(400).json({ error: "codeName, icon, and studentName are required" });
    return;
  }
  const key = roomKey(codeName, icon);
  let room = rooms.get(key);
  if (!room) {
    room = {
      id: key,
      codeName: codeName.trim(),
      icon,
      members: [],
      verdict: null,
      createdAt: Date.now(),
    };
    rooms.set(key, room);
  }
  if (room.members.length >= 4) {
    res.status(409).json({ error: "This squad is already full (4/4 detectives). Check your team code name and icon." });
    return;
  }
  const panelIndex = room.members.length;
  room.members.push({ studentName: studentName.trim(), panelIndex, answers: [], score: null });
  res.json({ roomId: key, panelIndex, memberCount: room.members.length });
});

router.get("/rooms/:id/status", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  res.json({
    memberCount: room.members.length,
    members: room.members.map((m) => ({
      studentName: m.studentName,
      panelIndex: m.panelIndex,
      submitted: m.score !== null,
    })),
    allJoined: room.members.length >= 4,
    allSubmitted: room.members.length >= 4 && room.members.every((m) => m.score !== null),
    panelScores: room.members.map((m) => m.score),
    verdict: room.verdict,
  });
});

router.post("/rooms/:id/submit", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  const { panelIndex, score, answers } = req.body as {
    panelIndex?: number;
    score?: number;
    answers?: (string | null)[];
  };
  if (panelIndex === undefined || score === undefined) {
    res.status(400).json({ error: "panelIndex and score are required" });
    return;
  }
  const member = room.members.find((m) => m.panelIndex === panelIndex);
  if (!member) {
    res.status(404).json({ error: "Member not found" });
    return;
  }
  member.score = score;
  member.answers = answers ?? [];
  res.json({ ok: true });
});

router.post("/rooms/:id/verdict", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  const { verdict } = req.body as { verdict?: string };
  if (!verdict?.trim()) {
    res.status(400).json({ error: "verdict is required" });
    return;
  }
  room.verdict = verdict.trim();
  res.json({ ok: true });
});

export default router;
