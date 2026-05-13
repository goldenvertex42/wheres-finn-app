import { prisma } from "db";

// GET /api/leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const topScores = await prisma.leaderboard.findMany({
      orderBy: { timeMs: 'asc' }, // Fastest times first
      take: 10,
    });
    return res.status(200).json(topScores);
  } catch (error) {
    console.error("Failed to fetch leaderboard:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST /api/leaderboard
export const submitScore = async (req, res) => {
  const { username, timeMs } = req.body;

  if (!timeMs || typeof timeMs !== 'number') {
    return res.status(400).json({ message: "Invalid score data received." });
  }

  try {
    // Wrap database reads and writes in a transaction to handle concurrent completions safely
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Fetch current top 10 scores to evaluate cutoff thresholds
      const currentTopTen = await tx.leaderboard.findMany({
        orderBy: { timeMs: 'asc' },
        take: 10,
      });

      // 2. Evaluate if score qualifies for entry
      const maxEntries = 10;
      const isBoardFull = currentTopTen.length >= maxEntries;
      const worstQualifyingTime = isBoardFull ? currentTopTen[currentTopTen.length - 1].timeMs : null;

      // Check business constraint: Must be faster than the 10th score if board is full
      if (isBoardFull && timeMs >= worstQualifyingTime) {
        return {
          status: 200,
          payload: { qualified: false, message: "Great effort, but your time did not make the Top 10 leaderboard!" }
        };
      }

      // 3. Clean up the database: Delete the 10th spot to keep the table lean
      if (isBoardFull) {
        const extraRecordId = currentTopTen[currentTopTen.length - 1].id;
        await tx.leaderboard.delete({
          where: { id: extraRecordId }
        });
      }

      // 4. Save new high score record (Maps 'username' from req.body to schema field 'name')
      const finalName = username?.trim() || "Anonymous";
      const newRecord = await tx.leaderboard.create({
        data: { 
          name: finalName, 
          timeMs: timeMs 
        }
      });

      return {
        status: 201,
        payload: { qualified: true, message: `Congratulations! ${finalName} made the leaderboard.`, record: newRecord }
      };
    });

    return res.status(result.status).json(result.payload);

  } catch (error) {
    console.error("Failed to validate or submit high score entry:", error);
    return res.status(500).json({ message: "Internal server error occurred." });
  }
};
