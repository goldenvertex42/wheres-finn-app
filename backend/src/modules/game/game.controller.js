import { prisma } from "db";



// In-memory session tracking for server-side timing
// (We will replace this with a temp table or session store later)
const activeSessions = new Map();

export const getCharacters = async (req, res) => {
  try {
    const characters = await prisma.character.findMany({
      select: {
        id: true,
        name: true
      }
    });
    return res.status(200).json(characters);
  } catch (error) {
      console.error("Failed to fetch characters:", error);
      return res.status(500).json({ message: "Internal server error" });
  }
};

export const startGame = (req, res) => {
  const sessionId = req.ip; // Simplest temporary session tracker using IP address
  activeSessions.set(sessionId, { startTime: Date.now() });

  console.log(`Game started for session: ${sessionId}`);
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
    const sessionId = req.ip;
    const session = activeSessions.get(sessionId);

    // Security Check: Ensure the user actually hit the /start endpoint first
    if (!session || !session.startTime) {
      return res.status(400).json({ 
        success: false, 
        message: "No active game session found. Did you start the game?" 
      });
    }

    // Calculate precise server-side elapsed time
    const endTime = Date.now();
    const serverTimeMs = endTime - session.startTime;

    // Clean up memory: Delete the session so it can't be reused/submitted twice
    activeSessions.delete(sessionId);
    console.log(`Game finished for session ${sessionId}. Total time: ${serverTimeMs}ms`);

    // Fetch the current Top 10 leaderboard entries sorted by fastest time (ascending)
    const topScores = await prisma.leaderboard.findMany({
      orderBy: { timeMs: 'asc' },
      take: 10
    });

    // Determine high-score eligibility (Qualifies if table has < 10 entries OR beats the 10th place time)
    const qualifiesForLeaderboard = 
      topScores.length < 10 || 
      serverTimeMs < topScores[topScores.length - 1].timeMs;

    // Return the verified duration and leaderboard qualification status to frontend
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

