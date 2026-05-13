import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import gameRoutes from './modules/game/game.routes.js';
import leaderboardRoutes from './modules/leaderboard/leaderboard.routes.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Parse current directory paths using Native ES Modules requirements
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly point to the centralized .env file located at the monorepo root
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); 

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const server = app.listen(PORT, () => { 
  console.log(`Where's Finn API - listening on port ${PORT}!`); 
});

server.on('error', (error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1); 
});