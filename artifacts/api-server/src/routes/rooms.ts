import { Router } from "express";

interface RoomMember {
  studentName: string;
  panelIndex: number;
  answers: (string | null)[];
  score: number | null;
  hasBadge: boolean;
}

interface VoteRecord {
  panelIndex: number;
  voteKey: string;
}

interface Room {
  id: string;
  codeName: string;
  icon: string;
  members: RoomMember[];
  verdict: string | null;
  createdAt: number;
  assemblyMembers: number[];
  voteRoundNumber: number;
  roundVotes: VoteRecord[];
  voteComplete: boolean;
  voteUnanimous: boolean | null;
  voteCorrect: boolean | null;
  agreedKey: string | null;
  teamBadgesEarned: number;
  assemblyHintsUsed: number;
}

const CORRECT_VOTE_KEY = "B";

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
    room = {
      id: key, codeName: codeName.trim(), icon, members: [], verdict: null, createdAt: Date.now(),
      assemblyMembers: [], voteRoundNumber: 1, roundVotes: [],
      voteComplete: false, voteUnanimous: null, voteCorrect: null, agreedKey: null,
      teamBadgesEarned: 0, assemblyHintsUsed: 0,
    };
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

  const myVotesThisRound = (panelIndex: number) =>
    room.roundVotes.find((v) => v.panelIndex === panelIndex)?.voteKey ?? null;

  res.json({
    memberCount: room.members.length,
    members: room.members.map((m) => ({
      studentName: m.studentName, panelIndex: m.panelIndex,
      submitted: m.score !== null, hasBadge: m.hasBadge,
    })),
    allJoined: room.members.length >= 4,
    allSubmitted: room.members.length >= 4 && room.members.every((m) => m.score !== null),
    panelScores: room.members.map((m) => m.score),
    panelBadges: room.members.map((m) => m.hasBadge),
    verdict: room.verdict,
    assemblyMembers: room.assemblyMembers,
    allInAssembly: room.assemblyMembers.length >= 4,
    voteRoundNumber: room.voteRoundNumber,
    roundVotesCount: room.roundVotes.length,
    allVotedThisRound: room.roundVotes.length >= 4,
    voteComplete: room.voteComplete,
    voteUnanimous: room.voteUnanimous,
    voteCorrect: room.voteCorrect,
    agreedKey: room.agreedKey,
    teamBadgesEarned: room.teamBadgesEarned,
    assemblyHintsUsed: room.assemblyHintsUsed,
  });
});

router.post("/rooms/:id/submit", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  const { panelIndex, score, answers, hasBadge } = req.body as {
    panelIndex?: number; score?: number; answers?: (string | null)[]; hasBadge?: boolean;
  };
  if (panelIndex === undefined || score === undefined) {
    res.status(400).json({ error: "panelIndex and score are required" }); return;
  }
  const member = room.members.find((m) => m.panelIndex === panelIndex);
  if (!member) { res.status(404).json({ error: "Member not found" }); return; }
  member.score = score;
  member.answers = answers ?? [];
  member.hasBadge = hasBadge ?? false;
  res.json({ ok: true });
});

router.post("/rooms/:id/assembly-join", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  const { panelIndex } = req.body as { panelIndex?: number };
  if (panelIndex === undefined) { res.status(400).json({ error: "panelIndex required" }); return; }
  if (!room.assemblyMembers.includes(panelIndex)) {
    room.assemblyMembers.push(panelIndex);
  }
  res.json({ ok: true, assemblyCount: room.assemblyMembers.length });
});

router.post("/rooms/:id/request-hint", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  if (room.assemblyHintsUsed >= 2) {
    res.status(409).json({ error: "No hints remaining." }); return;
  }
  room.assemblyHintsUsed += 1;
  res.json({ ok: true, hintsUsed: room.assemblyHintsUsed });
});

router.post("/rooms/:id/vote", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  if (room.voteComplete) { res.json({ ok: true, alreadyComplete: true }); return; }
  const { panelIndex, voteKey } = req.body as { panelIndex?: number; voteKey?: string };
  if (panelIndex === undefined || !voteKey) {
    res.status(400).json({ error: "panelIndex and voteKey required" }); return;
  }
  const alreadyVoted = room.roundVotes.find((v) => v.panelIndex === panelIndex);
  if (alreadyVoted) {
    alreadyVoted.voteKey = voteKey;
  } else {
    room.roundVotes.push({ panelIndex, voteKey });
  }
  if (room.roundVotes.length >= 4) {
    const keys = room.roundVotes.map((v) => v.voteKey);
    const unanimous = keys.every((k) => k === keys[0]);
    const correct = unanimous && keys[0] === CORRECT_VOTE_KEY;
    room.voteUnanimous = unanimous;
    room.voteCorrect = correct;
    room.agreedKey = unanimous ? keys[0] : null;
    if (correct) {
      room.teamBadgesEarned = room.voteRoundNumber === 1 ? 5 : 3;
      room.voteComplete = true;
    } else if (room.voteRoundNumber >= 2) {
      room.teamBadgesEarned = 0;
      room.voteComplete = true;
    } else {
      room.voteRoundNumber += 1;
      room.roundVotes = [];
      room.voteUnanimous = null;
      room.voteCorrect = null;
      room.agreedKey = null;
    }
  }
  res.json({ ok: true });
});

router.get("/admin/leaderboard", (_req, res) => {
  const allRooms = Array.from(rooms.values()).map((room) => ({
    roomId: room.id,
    codeName: room.codeName,
    icon: room.icon,
    memberCount: room.members.length,
    members: room.members.map((m) => ({
      studentName: m.studentName,
      panelIndex: m.panelIndex,
      score: m.score,
      hasBadge: m.hasBadge,
    })),
    allJoined: room.members.length >= 4,
    allSubmitted: room.members.length >= 4 && room.members.every((m) => m.score !== null),
    panelScores: room.members.map((m) => m.score),
    panelBadges: room.members.map((m) => m.hasBadge),
    individualBadgeCount: room.members.filter((m) => m.hasBadge).length,
    assemblyMemberCount: room.assemblyMembers.length,
    allInAssembly: room.assemblyMembers.length >= 4,
    voteRoundNumber: room.voteRoundNumber,
    voteComplete: room.voteComplete,
    voteCorrect: room.voteCorrect,
    agreedKey: room.agreedKey,
    teamBadgesEarned: room.teamBadgesEarned,
    totalBadges: room.members.filter((m) => m.hasBadge).length + room.teamBadgesEarned,
    createdAt: room.createdAt,
  }));
  res.json({ rooms: allRooms.sort((a, b) => b.totalBadges - a.totalBadges) });
});

router.delete("/rooms/:id", (req, res) => {
  const key = decodeURIComponent(req.params.id);
  if (!rooms.has(key)) { res.status(404).json({ error: "Room not found" }); return; }
  rooms.delete(key);
  res.json({ ok: true });
});

router.post("/rooms/:id/verdict", (req, res) => {
  const room = rooms.get(decodeURIComponent(req.params.id));
  if (!room) { res.status(404).json({ error: "Room not found" }); return; }
  const { verdict } = req.body as { verdict?: string };
  if (!verdict?.trim()) { res.status(400).json({ error: "verdict is required" }); return; }
  room.verdict = verdict.trim();
  res.json({ ok: true });
});

export default router;
