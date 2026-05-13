import { Router } from 'express';
import { startGame, validateClick } from './game.controller.js';

const router = Router();

router.post('/start', startGame);
router.post('/validate', validateClick);

export default router;
