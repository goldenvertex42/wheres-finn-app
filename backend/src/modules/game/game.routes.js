import { Router } from 'express';
import { getCharacters, startGame, validateClick, finishGame } from './game.controller.js';

const router = Router();

router.get('/characters', getCharacters);
router.post('/start', startGame);
router.post('/validate', validateClick);
router.post('/finish', finishGame);

export default router;
