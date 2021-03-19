import {playerStore} from "../services/playerStore.js";

function handleGetHome(req, res){
  res.render('home', { title: 'hangman' });
}

async function handleGetRanking(req, res){
  const ranking = await playerStore.get({}, {score: -1}, 5);
  res.render('ranking', {title:'hangman', players: ranking});
}

export {handleGetHome, handleGetRanking};