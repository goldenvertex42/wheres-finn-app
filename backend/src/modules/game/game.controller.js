// Hardcoded win-zones for testing (matches your measured % exactly)
const TARGETS = {
  'Finn': { relX: 67.72, relY: 69.54 },
  'Jake': { relX: 25.83, relY: 74.51 },
  'Princess Bubblegum': { relX: 91.28, relY: 72.74 },
  'Lady Rainicorn': { relX: 5.94, relY: 9.15 },
  'Marceline': { relX: 40.94, relY: 66.87 },
  'Ice King': { relX: 17.06, relY: 72.56 },
  'Lumpy Space Princess': { relX: 6.72, relY: 81.08 },
  'Peppermint Butler': { relX: 85.28, relY: 86.23 },
  'The Royal Tart Toter': { relX: 9.61, relY: 58.88 },
  'Gunther': { relX: 24.28, relY: 63.50 },
  'Poo-brained Horse': { relX: 29.06, relY: 61.55 },
  'Starchy': { relX: 16.06, relY: 88.54 },
  'Mr. Cupcake': { relX: 56.06, relY: 73.09 },
  'Jiggler': { relX: 57.39, relY: 84.81 }
};

// In-memory session tracking for server-side timing
// (We will replace this with a temp table or session store later)
const activeSessions = new Map();

export const startGame = (req, res) => {
  const sessionId = req.ip; // Simplest temporary session tracker using IP address
  activeSessions.set(sessionId, { startTime: Date.now() });

  console.log(`Game started for session: ${sessionId}`);
  return res.status(200).json({ message: "Game started successfully." });
};

export const validateClick = (req, res) => {
  const { characterName, userX, userY } = req.body;
  const target = TARGETS[characterName];

  if (!target) {
    return res.status(404).json({ hit: false, message: "Character not found." });
  }

  const margin = 3.0; 
  const isHit = Math.abs(userX - target.relX) <= margin && 
                Math.abs(userY - target.relY) <= margin;

  if (isHit) {
    return res.status(200).json({ hit: true, message: `You found ${characterName}!` });
  }

  return res.status(200).json({ hit: false, message: "Keep looking!" });
};
