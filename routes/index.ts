import {playerStore} from "../services/playerStore.js";
import {gamestateStore} from "../services/gamestateStore.js";
import cookieParser from "cookie-parser";
import {wordService} from "../services/wordService.js";
import Gamestate from "../services/gamestate.js";
import mongo from "mongodb"

async function handleGetHome(req, res){
  res.render('home', { title: 'hangman' });
}

function handleGetLogin(req,res){
  res.render('login', {title:'hangman', layout:false});
}

async function handleGetRanking(req, res){
  const ranking = await playerStore.get({}, {score: -1}, 5);
  res.render('ranking', {title:'hangman', players: ranking});
}

async function getGame(req, res){
  let gameId : string = "";
  if(req.cookies.game_id){
    gameId = req.cookies.game_id;
  }else { //create new game
    let word = await wordService.getRandomWord();
    let inserted = await gamestateStore.add(new Gamestate(word, [],[]));
    gameId = String(inserted.ops[0]._id);
    res.cookie('game_id', gameId, {maxAge:900000});
  }
  let state = (await gamestateStore.get({_id: mongo.ObjectId(gameId)}, {}, 1))[0]; //Returns array even with limit 1
  res.render('game', {title:'hangman', wordLength: state.wordToGuess.length});
}

//Für debugging
async function handlePutCharacter(req, res) {
  console.log(req.params.id);
  console.log(req.params.character);
  res.json({correctlyGuessedCharacters: {A: 0, L: 3}, wronglyGuessedCharacters: ['X', 'U']}); //nüme nötig
}

//Für debugging
async function handleGetGameState(req, res) {
  res.json({correctlyGuessedCharacters: {A: 0, L: 3}, wronglyGuessedCharacters: ['X', 'U']});
}

export {handleGetHome, handleGetLogin, handleGetRanking, getGame, handlePutCharacter, handleGetGameState};
