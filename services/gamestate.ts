import CorrectCharacter from "./correctCharacter.js"

export enum GameStateEnum{
    ongoing = "ongoing",
    won = "won",
    lost = "lost"
}

export class Gamestate {
    readonly wordToGuess: string;
    correctlyGuessedCharacters: Array<CorrectCharacter>;
    wronglyGuessedCharacters: Array<string>;
    state : GameStateEnum;
    gameOwnerId : string;

    constructor(wordToGuess : string, gameOwnerId : string) {
        this.wordToGuess = wordToGuess;
        this.correctlyGuessedCharacters = new Array<CorrectCharacter>();
        this.wronglyGuessedCharacters = new Array<string>();
        this.state = GameStateEnum.ongoing;
        this.gameOwnerId = gameOwnerId;
    }
}