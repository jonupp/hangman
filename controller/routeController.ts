import express from "express";
import {playerStore} from "../services/playerStore.js";
import {handleGetHome, handleGetLogin, handleGetRanking, getGame, handlePutCharacter, handleGetGameState} from "../routes/index.js";
const router = express.Router();

router.get('/', handleGetHome);

router.get('/login', handleGetLogin);

router.get('/game', getGame);

router.get('/ranking', handleGetRanking);

router.put('/game/:id/:character', handlePutCharacter);
router.get('/game/:id/', handleGetGameState);

export default router;