import {wordService} from "../services/wordService.js";
import {gamestateStore} from "../services/gamestateStore.js";
import {Gamestate, GameStateEnum} from "../services/gamestate.js";
import mongo from "mongodb";
import CorrectCharacter from "../services/correctCharacter.js"

const MAX_NUMBER_OF_TRIES = 6;

async function getGame(req, res){
    let gameId : string = "";

    if(req.cookies.game_id){
        gameId = req.cookies.game_id;
    }else { //create new game
        //TODO: Insert game_owner (player_id) into gamestate to prevent griefing
        let word = await wordService.getRandomWord();
        let inserted = await gamestateStore.add(new Gamestate(word));
        gameId = String(inserted.ops[0]._id);
        res.cookie('game_id', gameId, {maxAge:900000});
    }
    let state = (await gamestateStore.get({_id: new mongo.ObjectId(gameId)}, {}, 1))[0]; //Returns array even with limit 1
    res.render('game', {title:'hangman', wordLength: state.wordToGuess.length});
}

async function handleGetGameGameId(req, res){
    let gameId = req.params.game_id;
    let gamestate = (await gamestateStore.get({_id: new mongo.ObjectId(gameId)}, {}, 1))[0];
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            correctlyGuessedCharacters: gamestate.correctlyGuessedCharacters,
            wronglyGuessedCharacters: gamestate.wronglyGuessedCharacters,
            state: gamestate.state
        }
    ));
}

async function handlePutGameGameIdCharacter(req, res){
    //TODO: Check if request comes from the player owning the game
    //Otherwise everybody can send requests and grief other games

    let gameId = req.params.game_id;
    let character = req.params.character;

    let gamestate = (await gamestateStore.get({_id: new mongo.ObjectId(gameId)}, {}, 1))[0];

    if(gamestate.state !== "ongoing"){
        res.status(400).send({ error: "Can not put to finished game" });
        return;
    }

    //Check if character was not already used
    if(gamestate.correctlyGuessedCharacters.some((char)=>{return char.char === character})
        || gamestate.wronglyGuessedCharacters.includes(character)){
        res.status(400).send({ error: 'Character was already used' });
        return;
    }

    //Check if character is in wordToGuess
    if(gamestate.wordToGuess.includes(character)){
        let positions = new Array<number>();
        for(let i = 0; i < gamestate.wordToGuess.length; i++){
            if(gamestate.wordToGuess.charAt(i) === character){
                positions.push(i);
            }
        }
        //Find Positions in word for character
        let correctCharacter = new CorrectCharacter(character, positions);

        let newcorrectlyGuessedCharacters = gamestate.correctlyGuessedCharacters.concat([correctCharacter]);
        await gamestateStore.update(gameId, { correctlyGuessedCharacters: newcorrectlyGuessedCharacters});
    }else{
        let newwronglyGuessedCharacters = gamestate.wronglyGuessedCharacters.concat([character]);
        await gamestateStore.update(gameId, {  wronglyGuessedCharacters: newwronglyGuessedCharacters});
    }

    gamestate = (await gamestateStore.get({_id: new mongo.ObjectId(gameId)}, {}, 1))[0];

    let wordToGuessArray = gamestate.wordToGuess.split("");

    //Word completely guessed?
    if(wordToGuessArray.every((char)=>{  return gamestate.correctlyGuessedCharacters.some((correctChar)=>{return char===correctChar.char})})){
       //TODO: Update player score - for this the JWT Token is necessary bc. it contains the player_id
        await gamestateStore.update(gameId, {state: "won"});
    }else{ //If not completely gussed check if there are tries left
        let numberOfTries = /*gamestate.correctlyGuessedCharacters.length + */gamestate.wronglyGuessedCharacters.length;
        if(numberOfTries >= MAX_NUMBER_OF_TRIES){ //lost
            await gamestateStore.update(gameId, {state: "lost"});
        }
    }
    //Updated gamestate is needed
    gamestate = (await gamestateStore.get({_id: new mongo.ObjectId(gameId)}, {}, 1))[0];

    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(
        {
            correctlyGuessedCharacters: gamestate.correctlyGuessedCharacters,
            wronglyGuessedCharacters: gamestate.wronglyGuessedCharacters,
            state:gamestate.state
        }
    ));
}

async function handleGetEndgame(req, res){
    if(!req.cookies.game_id){
        res.status(400).send({error: 'The game has not been started yet'});
    }

    let gamestate = (await gamestateStore.get({_id: new mongo.ObjectId(req.cookies.game_id)}, {}, 1))[0];

    //Check if game is already finished
    if(gamestate.state === "won"){
        res.clearCookie("game_id");
        res.render('endgame', {won: true, correctWord: gamestate.wordToGuess});
    }else if(gamestate.state === "lost"){
        res.clearCookie("game_id");
        res.render('endgame', {won: false, correctWord: gamestate.wordToGuess});
    }else {
        res.status(400).send({error: 'The game is not finished yet'});
    }
}

export {getGame, handleGetGameGameId, handlePutGameGameIdCharacter, handleGetEndgame};