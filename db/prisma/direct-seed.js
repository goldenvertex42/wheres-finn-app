import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const characters = [
  { name: 'Finn', relX: 67.72, relY: 69.54 },
  { name: 'Jake', relX: 25.83, relY: 74.51 },
  { name: 'Princess Bubblegum', relX: 91.28, relY: 72.74 },
  { name: 'Lady Rainicorn', relX: 5.94, relY: 9.15 },
  { name: 'Marceline', relX: 40.94, relY: 66.87 },
  { name: 'Ice King', relX: 17.06, relY: 72.56 },
  { name: 'Lumpy Space Princess', relX: 6.72, relY: 81.08 },
  { name: 'Peppermint Butler', relX: 85.28, relY: 86.23 },
  { name: 'The Royal Tart Toter', relX: 9.61, relY: 58.88 },
  { name: 'Gunther', relX: 24.28, relY: 63.50 },
  { name: 'Poo-brained Horse', relX: 29.06, relY: 61.55 },
  { name: 'Starchy', relX: 16.06, relY: 88.54 },
  { name: 'Mr. Cupcake', relX: 56.06, relY: 73.09 },
  { name: 'Jiggler', relX: 57.39, relY: 84.81 }
];

const dummyScores = [
  { name: 'Billy_Hero', timeMs: 25000 },      // 00:25 - The ultimate target
  { name: 'GumballGuard', timeMs: 42000 },    // 00:42
  { name: 'Rattleballs', timeMs: 55000 },     // 00:55
  { name: 'Susan_Strong', timeMs: 71000 },    // 01:11
  { name: 'CinnamonBun', timeMs: 95000 },     // 01:35
  { name: 'ChooseGoose', timeMs: 124000 },    // 02:04
  { name: 'Finn_The_Human', timeMs: 140000 }, // 02:20
  { name: 'Jake_The_Dog', timeMs: 185000 },   // 03:05
  { name: 'NEPTR', timeMs: 240000 },          // 04:00
  { name: 'LumpySpaceP', timeMs: 310000 }      // 05:10 - The baseline to beat
];


async function run() {
  // Pulls connection string from your root .env automatically
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  
  console.log("Directly seeding characters into wheres_finn_local database...");

  for (const char of characters) {
    // Standard PostgreSQL Upsert (ON CONFLICT DO UPDATE)
    const query = `
      INSERT INTO "character" (name, "relX", "relY") 
      VALUES ($1, $2, $3)
      ON CONFLICT (name) 
      DO UPDATE SET "relX" = EXCLUDED."relX", "relY" = EXCLUDED."relY";
    `;
    await client.query(query, [char.name, char.relX, char.relY]);
  }

  console.log("Directly seeding arcade-style default high scores...");
  
  await client.query('TRUNCATE TABLE "leaderboard" RESTART IDENTITY;');

  for (const score of dummyScores) {
    const query = `
      INSERT INTO "leaderboard" (name, "timeMs", "createdAt") 
      VALUES ($1, $2, NOW());
    `;
    await client.query(query, [score.name, score.timeMs]);
  }


  console.log("🚀 Direct data injection successful!");
  await client.end();
}

run().catch(console.error);
