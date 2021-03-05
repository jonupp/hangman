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
  res.render('ranking', {title:'hangman', players: await playerStore.getAll({score: 1}, 3)});
});

export default router;
