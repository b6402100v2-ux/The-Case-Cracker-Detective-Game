import { Router } from "express";

interface RoomMember {
  studentName: string;
  panelIndex: number;
  answers: (string | null)[];
  score: number | null;
  hasBadge: boolean;
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

router.get("/rooms/availability", (req, res) => {
  const codeName = req.query.codeName as string | undefined;
  const icon = req.query.icon as string | undefined;
  if (!codeName || !icon) {
    res.status(400).json({ error: "codeName and icon are required" });
    return;
  }
  const key = roomKey(codeName, icon);
  const room = rooms.get(key);
  const takenPanels = room ? room.members.map((m) => m.panelIndex) : [];
  res.json({ exists: !!room, memberCount: room?.members.length ?? 0, takenPanels });
});

router.post("/rooms/join", (req, res) => {
  const { codeName, icon, studentName, panelIndex } = req.body as {
    codeName?: string;
    icon?: string;
    studentName?: string;
    panelIndex?: number;
  };
  if (!codeName || !icon || !studentName || panelIndex === undefined) {
    res.status(400).json({ error: "codeName, icon, studentName, and panelIndex are required" });
    return;
  }
  if (panelIndex < 0 || panelIndex > 3) {
    res.status(400).json({ error: "panelIndex must be 0–3" });
    return;
  }
  const key = roomKey(codeName, icon);
  let room = rooms.get(key);
  if (!room) {
    room = { id: key, codeName: codeName.trim(), icon, members: [], verdict: null, createdAt: Date.now() };
    rooms.set(key, room);
  }
  if (room.members.length >= 4) {
    res.status(409).json({ error: "This squad is already full (4/4 detectives)." });
    return;
  }
  if (room.members.some((m) => m.panelIndex === panelIndex)) {
    res.status(409).json({ error: "That panel is already claimed by another detective. Pick a different one." });
    return;
  }
  room.members.push({ studentName: studentName.trim(), panelIndex, answers: [], score: null, hasBadge: false });
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
      hasBadge: m.hasBadge,
    })),
    allJoined: room.members.length >= 4,
    allSubmitted: room.members.length >= 4 && room.members.every((m) => m.score !== null),
    panelScores: room.members.map((m) => m.score),
    panelBadges: room.members.map((m) => m.hasBadge),
    verdict: room.verdict,
  });
});

router.post("/rooms/:id/submit", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) {
    res.status(404).json({ error: "Room not found" });
    return;
  }
  const { panelIndex, score, answers, hasBadge } = req.body as {
    panelIndex?: number;
    score?: number;
    answers?: (string | null)[];
    hasBadge?: boolean;
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
  member.hasBadge = hasBadge ?? false;
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
