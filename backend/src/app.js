import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import gameRoutes from './modules/game/game.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/game', gameRoutes);

const server = app.listen(PORT, () => { 
  console.log(`Where's Finn API - listening on port ${PORT}!`); 
});

server.on('error', (error) => {
  console.error("Server failed to start:", error.message);
  process.exit(1); 
});