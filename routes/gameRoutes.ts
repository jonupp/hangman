import {wordService} from "../services/wordService.js";
import {gamestateStore} from "../services/gamestateStore.js";
import Gamestate from "../services/gamestate.js";
import mongo from "mongodb";

const MAX_NUMBER_OF_TRIES = 5;

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

async function handleGetGameGameId(req, res){
    let gameId = req.params.game_id;
    let state = (await gamestateStore.get({_id: mongo.ObjectId(gameId)}, {}, 1))[0];
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            correctlyGuessedCharacters: state.correctlyGuessedCharacters,
            wronglyGuessedCharacters: state.wronglyGuessedCharacters }
    ));
}

async function handlePutGameGameIdCharacter(req, res){
    let gameId = req.params.game_id;
    let character = req.params.character;

    let state = (await gamestateStore.get({_id: mongo.ObjectId(gameId)}, {}, 1))[0];

    //Check if character was not already used
    if(state.correctlyGuessedCharacters.includes(character) || state.wronglyGuessedCharacters.includes(character)){
        res.status(400).send({ error: 'Character was already used' });
    }

    if(state.wordToGuess.includes(character)){
        let newcorrectlyGuessedCharacters = state.correctlyGuessedCharacters.concat([character]);
        await gamestateStore.update(gameId, { correctlyGuessedCharacters: newcorrectlyGuessedCharacters});
    }else{
        let newwronglyGuessedCharacters = state.wronglyGuessedCharacters.concat([character]);
        await gamestateStore.update(gameId, {  wronglyGuessedCharacters: newwronglyGuessedCharacters});
    }

    state = (await gamestateStore.get({_id: mongo.ObjectId(gameId)}, {}, 1))[0];

    let wordToGuessArray = state.wordToGuess.split("");

    if(wordToGuessArray.every((char)=>{return state.correctlyGuessedCharacters.includes(char)})){ //Word completely guessed
       //TODO: Update player score - for this the JWT Token is necessary bc. it contains the player_id
        res.redirect('/endgame/won');
    }else{ //If not completely gussed check if there are tries left
        let numberOfTries = state.correctlyGuessedCharacters.length + state.wronglyGuessedCharacters.length;
        if(numberOfTries >= MAX_NUMBER_OF_TRIES){ //lost
            //res.redirect('/endgame/lost');
            res.json({state: 'lost'});
        }else{ //guess again
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(
                {
                    correctlyGuessedCharacters: state.correctlyGuessedCharacters,
                    wronglyGuessedCharacters: state.wronglyGuessedCharacters }
            ));
        }
    }
}

async function handleGetEndgame(req, res){
    //res.render('endgame', {won: false, correctWord: 'Apple'});
    //return;
    if(!req.cookies.game_id){
        res.status(400).send({error: 'The game has not been started yet'});
    }

    let state = (await gamestateStore.get({_id: mongo.ObjectId(req.cookies.game_id)}, {}, 1))[0];

    let numberOfTries = state.correctlyGuessedCharacters.length + state.wronglyGuessedCharacters.length;
    let wordToGuessArray = state.wordToGuess.split("");

    //Check if game is already finished
    if(wordToGuessArray.every((char)=>{return state.correctlyGuessedCharacters.includes(char)}) || numberOfTries >= MAX_NUMBER_OF_TRIES){
        let result = req.params.result;
        let correctWord = state.wordToGuess;
        res.clearCookie("game_id");
        res.render('endgame', {won: result === 'won', correctWord: correctWord});
    }else{
        res.status(400).send({error: 'The game is not finished yet'});
    }
}

export {getGame, handleGetGameGameId, handlePutGameGameIdCharacter, handleGetEndgame};