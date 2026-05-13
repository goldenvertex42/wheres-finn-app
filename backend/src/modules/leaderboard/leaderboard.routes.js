import express from 'express';
import { getLeaderboard, submitScore } from './leaderboard.controller.js';

const router = express.Router();

router.get('/', getLeaderboard);
router.post('/', submitScore);

export default router;
