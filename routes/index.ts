import {playerStore} from "../services/playerStore.js";

async function handleGetHome(req, res){
  const { username, score } = await playerStore.getByPlayerId(req.player_id);
  res.render('home', { title: 'hangman', username, score });
}

async function handleGetRanking(req, res){
  const ranking = await playerStore.get({}, {score: -1}, 5);
  res.render('ranking', {title:'hangman', players: ranking});
}

export {handleGetHome, handleGetRanking};