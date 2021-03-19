import { gameService } from "../services/gameService.js";
import { parseCookie, getIndexFromCharacter } from "../utils/utils.js";

function initGame() {
    const gameId = parseCookie().game_id;
    const alphaButtons = document.querySelectorAll("button");
    const toGuessPlaceholders = document.querySelectorAll("span");
    const formRedirection = document.querySelector("#endgame-redirection");

    for(const alphaButton of alphaButtons) {
        alphaButton.addEventListener('click', characterPressedHandler);
    }

    async function render() {
        const gameState = await gameService.getGame(gameId);
        //paintGuessedCharacters(gameState.correctlyGuessedCharacters);
        paintWrongCharacters(gameState.wronglyGuessedCharacters);
        paintImage();
    }

    function paintGuessedCharacters(characters) {
        for(const c in characters) {
            toGuessPlaceholders[characters[c]].innerText = c;
        }
    }

    function paintWrongCharacters(characters) {
        for(const c of characters) {
            alphaButtons[getIndexFromCharacter(c)].style.backgroundColor = "red";
        }
    }

    function paintImage() {

    }

    async function characterPressedHandler(event) {
        //const pressedCharacter = event.target.innerText;
        //fetch(`/game/${gameId}/${pressedCharacter}`, {headers: new Headers({'content-type': 'text/html'})});
        //const j = await response.json();
        //console.log(j);
        const pressedCharacter = event.target.innerText;
        const result = await gameService.putCharacter(gameId, pressedCharacter);
        console.log(result);
        render();
    }
}

window.onload = initGame;