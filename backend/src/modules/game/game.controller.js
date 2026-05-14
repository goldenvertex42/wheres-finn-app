import { prisma } from "../../../../db/src/index.js"; 

// In-memory session tracking for server-side timing
const activeSessions = new Map(); 

export const getCharacters = async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      select: { id: true, name: true }
    });
    return res.status(200).json(characters);
  } catch (error) {
    console.error("Failed to fetch characters:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const startGame = (req, res) => {
  /* Resolves the true user IP behind cloud network load balancers 
     by reading x-forwarded-for headers before failing back to default req.ip */
  const sessionId = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;

  activeSessions.set(sessionId, { startTime: Date.now() });
  console.log(`Game started safely for unique session: ${sessionId}`);
  return res.status(200).json({ message: "Game started successfully." });
};

export const validateClick = async (req, res) => {
  try {
    const { characterId, characterName, userX, userY } = req.body;

    const target = await prisma.character.findUnique({
      where: { id: Number(characterId) }
    });

    if (!target) {
      return res.status(404).json({ hit: false, message: "Character not found." });
    }

    const margin = 3.0;
    const isHit = Math.abs(userX - target.relX) <= margin && Math.abs(userY - target.relY) <= margin;

    if (isHit) {
      return res.status(200).json({ hit: true, message: `You found ${characterName}!` });
    }

    return res.status(200).json({ hit: false, message: "Keep looking!" });
  } catch (error) {
    console.error("Database validation error:", error);
    return res.status(500).json({ hit: false, message: "Server error validating selection." });
  }
};

export const finishGame = async (req, res) => {
  try {
    // Uses the exact same header fallback matching check logic as startGame
    const sessionId = req.headers['x-forwarded-for']?.split(',')[0] || req.ip;
    const session = activeSessions.get(sessionId);

    // Security Check: Ensure the user actually hit the /start endpoint first
    if (!session || !session.startTime) {
      return res.status(400).json({ 
        success: false, 
        message: "No active game session found. Did you start the game?" 
      });
    }

    const endTime = Date.now();
    const serverTimeMs = endTime - session.startTime;

    // Clean up memory immediately to prevent replay attacks
    activeSessions.delete(sessionId);
    console.log(`Game finished for session ${sessionId}. Total verified time: ${serverTimeMs}ms`);

    const topScores = await prisma.leaderboard.findMany({
      orderBy: { timeMs: 'asc' },
      take: 10
    });

    const qualifiesForLeaderboard = 
      topScores.length < 10 || 
      serverTimeMs < topScores[topScores.length - 1].timeMs;

    return res.status(200).json({
      success: true,
      message: "Game complete! Score verified.",
      timeMs: serverTimeMs,
      qualifies: qualifiesForLeaderboard
    });
  } catch (error) {
    console.error("Error processing game finish:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Internal server error processing game completion." 
    });
  }
};
