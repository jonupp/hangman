import express from "express";
import {playerStore} from "../services/playerStore.js";

const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home', { title: 'hangman' });
});

router.get('/login', function(req, res, next){
  res.render('login', {title:'hangman', layout:false});
});

router.get('/play', function(req, res, next){
  res.render('play', {title:'hangman', wordLength:7});
});

router.get('/ranking', async function(req, res, next){
  await playerStore.update('6041415511e129dd6d84a4ea', {score: 56});
  const ranking = await playerStore.get({}, {score: -1}, 5);
  res.render('ranking', {title:'hangman', players: ranking});
});

export default router;
