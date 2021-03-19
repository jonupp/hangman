import express from "express";
import {playerStore} from "../services/playerStore.js";
import {handleGetHome, handleGetRanking} from "../routes/index.js";
import {handleGetLogin, handlePostRegister, handlePostLogin} from "../routes/accountRoutes.js";
import {handleGetEndgame, getGame, handleGetGameGameId, handlePutGameGameIdCharacter} from "../routes/gameRoutes.js";

const router = express.Router();

router.get('/', handleGetHome);

router.get('/login', handleGetLogin);

router.get('/game', getGame);

router.get('/ranking', handleGetRanking);

router.post('/register', handlePostRegister);

router.post('/login', handlePostLogin);

router.get('/game/:game_id/:character', handlePutGameGameIdCharacter);

router.get('/game/:game_id', handleGetGameGameId);

router.get('/endgame', handleGetEndgame);

export default router;