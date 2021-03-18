export default class Gamestate {
    wordToGuess: string;
    correctlyGuessedCharacters: [];
    wronglyGuessedCharacters: [];

    constructor(wordToGuess, correctlyGuessedCharacters, wronglyGuessedCharacters){
        this.wordToGuess = wordToGuess;
        this.correctlyGuessedCharacters = correctlyGuessedCharacters;
        this.wronglyGuessedCharacters = wronglyGuessedCharacters;
    }
}