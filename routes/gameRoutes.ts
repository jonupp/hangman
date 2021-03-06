import {wordService} from "../services/wordService.js";
import {gamestateStore} from "../services/gamestateStore.js";
import {Gamestate, GameStateEnum} from "../services/gamestate.js";
import CorrectCharacter from "../services/correctCharacter.js"
import {playerStore} from "../services/playerStore.js";

async function getGame(req, res){
    let gameId : string;
    const openGameInDBId = await getOpenGame(req.player_id);

    if(req.cookies.game_id){
        gameId = req.cookies.game_id;
    } else if (openGameInDBId) { //load open game
        gameId = openGameInDBId;
        res.cookie("game_id", gameId, {maxAge: 900000});
    } else { //create new game
        let word = await wordService.getRandomWord();
        let inserted = await gamestateStore.add(new Gamestate(word, req.player_id));
        gameId = String(inserted.ops[0]._id);
        res.cookie("game_id", gameId, {maxAge: 900000});
    }
    let state = await gamestateStore.getById(gameId);
    res.render("game", {title: "hangman", wordLength: state.wordToGuess.length});
}

async function getOpenGame(userId: string): Promise<string> {
    const openGame = await gamestateStore.getOneByOwnerId(userId);
    if (!openGame) {
        return "";
    } else {
        return openGame._id.toString();
    }
}

async function handleGetGameGameId(req, res){
    let gameId = req.params.game_id;
    let gamestate = await gamestateStore.getById(gameId);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(
        {
            correctlyGuessedCharacters: gamestate.correctlyGuessedCharacters,
            wronglyGuessedCharacters: gamestate.wronglyGuessedCharacters,
            state: gamestate.state
        }
    ));
}

async function handlePutGameGameIdCharacter(req, res){
    let gameId = req.params.game_id;
    let character = req.params.character;
    let gamestate = await gamestateStore.getById(gameId);

    if(req.player_id !== gamestate.gameOwnerId){ //Only owner of game can play
        res.status(400).send({ error: "You are not the owner of this game" });
        return;
    }
    if(gamestate.state !== GameStateEnum.ongoing){
        res.status(400).send({ error: "Can not put to finished game" });
        return;
    }
    if(characterWasAlreadyUsed(gamestate, character)){
        res.status(400).send({ error: "Character was already used" });
        return;
    }

    if(gamestate.wordToGuess.includes(character)){
        let positions = getCharacterPositionsInWordToGuess(gamestate, character);
        let correctCharacter = new CorrectCharacter(character, positions);

        let newcorrectlyGuessedCharacters = gamestate.correctlyGuessedCharacters.concat([correctCharacter]);
        await gamestateStore.update(gameId, {correctlyGuessedCharacters: newcorrectlyGuessedCharacters});
    }else{
        let newwronglyGuessedCharacters = gamestate.wronglyGuessedCharacters.concat([character]);
        await gamestateStore.update(gameId, {wronglyGuessedCharacters: newwronglyGuessedCharacters});
    }

    gamestate = await gamestateStore.getById(gameId);

    if( wordIsCompletelyGuessed(gamestate) ){
        let newScore = (await playerStore.getByPlayerId(req.player_id)).score + 1;
        await playerStore.update(req.player_id, {score:newScore});
        await gamestateStore.update(gameId, {state: GameStateEnum.won});
    }else{ //If not completely guessed check if there are tries left
        let numberOfTries = gamestate.wronglyGuessedCharacters.length;
        if(numberOfTries >= process.env.MAX_NUMBER_OF_TRIES!){ //lost
            await gamestateStore.update(gameId, {state: GameStateEnum.lost});
        }
    }

    gamestate = await gamestateStore.getById(gameId);

    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(
        {
            correctlyGuessedCharacters: gamestate.correctlyGuessedCharacters,
            wronglyGuessedCharacters: gamestate.wronglyGuessedCharacters,
            state: gamestate.state
        }
    ));
}

function getCharacterPositionsInWordToGuess(gamestate, character) {
    let positions = new Array<number>();
    for (let i = 0; i < gamestate.wordToGuess.length; i++) {
        if (gamestate.wordToGuess.charAt(i) === character) {
            positions.push(i);
        }
    }
    return positions;
}

function wordIsCompletelyGuessed(gamestate) {
    let wordToGuessArray = gamestate.wordToGuess.split("");

    return wordToGuessArray.every((char) => {
        return gamestate.correctlyGuessedCharacters.some((correctChar) => {
            return char === correctChar.char
        })
    });
}

function characterWasAlreadyUsed(gamestate, character) {
    return gamestate.correctlyGuessedCharacters.some((char) => {
            return char.char === character
        })
        || gamestate.wronglyGuessedCharacters.includes(character);
}

async function handleGetEndgame(req, res){
    let gameId = req.cookies.game_id;

    if(!gameId){
        res.status(400).send({error: "The game has not been started yet"});
    }

    let gamestate = await gamestateStore.getById(gameId);

    if(gamestate.state === GameStateEnum.won){
        res.clearCookie("game_id");
        res.render("endgame", {won: true, correctWord: gamestate.wordToGuess});
    }else if(gamestate.state === GameStateEnum.lost){
        res.clearCookie("game_id");
        res.render("endgame", {won: false, correctWord: gamestate.wordToGuess});
    }else {
        res.status(400).send({error: "The game is not finished yet"});
    }
}

export {getGame, handleGetGameGameId, handlePutGameGameIdCharacter, handleGetEndgame};
