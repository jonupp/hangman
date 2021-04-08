import express from "express";
import {handleGetHome, handleGetRanking} from "../routes/index.js";
import {handleGetLogin, handleGetLogout, handlePostRegister, handlePostLogin} from "../routes/accountRoutes.js";
import {handleGetEndgame, getGame, handleGetGameGameId, handlePutGameGameIdCharacter} from "../routes/gameRoutes.js";
import {authentication_middleware} from "../utils/authentication_middleware.js";

const router = express.Router();

router.get('/', authentication_middleware, handleGetHome);
router.get('/login', handleGetLogin);
router.get('/logout', handleGetLogout);
router.get('/game', authentication_middleware, getGame);
router.get('/ranking', authentication_middleware, handleGetRanking);
router.post('/register', handlePostRegister);
router.post('/login', handlePostLogin);
router.get('/game/:game_id/:character', authentication_middleware, handlePutGameGameIdCharacter);
router.get('/game/:game_id', authentication_middleware, handleGetGameGameId);
router.get('/endgame', authentication_middleware, handleGetEndgame);

export default router;
