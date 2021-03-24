import { gameService } from "../services/gameService.js";
import { parseCookie, getIndexFromCharacter } from "../utils/utils.js";

async function initGame() {
    // @ts-ignore
    const gameId = parseCookie().game_id;
    const alphaButtons = document.querySelectorAll("button");
    const toGuessPlaceholders = document.querySelectorAll("span");
    const endgameRedirection = document.querySelector("#endgame-redirection");
    const homeRedirection : HTMLFormElement = document.querySelector("#home-redirection")! ;
    const hangmanImage = document.querySelector("#state-image");

    for(const alphaButton of alphaButtons) {
        alphaButton.addEventListener('click', characterPressedHandler);
    }

    async function render() {
        const gameState = await gameService.getGame(gameId);
        paintGuessedCharacters(gameState.correctlyGuessedCharacters);
        paintWrongCharacters(gameState.wronglyGuessedCharacters);
        paintImage(gameState.wronglyGuessedCharacters.length);
    }

    function paintGuessedCharacters(characters) {
        for(const pair of characters) {
            for(const i of pair.positions) {
                toGuessPlaceholders[i].innerText = pair.char.toUpperCase();
                paintButton(pair.char, "green");
            }
        }
    }

    function paintWrongCharacters(characters) {
        for(const c of characters) {
            paintButton(c, "red");
        }
    }

    function paintImage(wrongGuesses) {
        // @ts-ignore
        hangmanImage.src = `/images/hangman_images/${wrongGuesses}F.svg`;
    }

    function paintButton(character, color) {
        alphaButtons[getIndexFromCharacter(character)].style.backgroundColor = color;
        alphaButtons[getIndexFromCharacter(character)].disabled = true;
    }

    async function characterPressedHandler(event) {
        const pressedCharacter = event.target.innerText.toLowerCase();
        const result = await gameService.putCharacter(gameId, pressedCharacter);

        if(result.error){
            //SHOW THAT IT IS BAD
            let errorP = document.getElementById('errorMessage')!;
            errorP.innerText = result.error;
            errorP.hidden = false;
            document.cookie = "game_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            setTimeout(()=>{homeRedirection.submit()}, 2000);
        }
        console.log(result);
        if(result.state==='won' || result.state === 'lost') {
            navigateToEndgame();
        }
        await render();
    }

    function navigateToEndgame() {
        // @ts-ignore
        setTimeout(() => endgameRedirection.submit(), 1000);
    }

    await render();
}

window.onload = initGame;