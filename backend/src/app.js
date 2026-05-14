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

const allowedOrigin = process.env.VITE_API_URL 
  ? process.env.VITE_API_URL.replace(':3000', ':5173') // Maps frontend port if using shared vars
  : 'http://localhost:5173';

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.PRODUCTION_FRONTEND_URL : allowedOrigin,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true, // Enables secure cookie tracking or session timestamp tokens across ports
  optionsSuccessStatus: 200 // Fixes legacy browser pre-flight checking handshake responses
};

app.use(cors(corsOptions));
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