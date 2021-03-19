import {httpService} from './httpService.js'

class GameService {
    async getGame(id) {
        return await httpService.ajax("GET", `/game/${id}`, undefined, undefined);
    }

    async putCharacter(id, character) {
        return await httpService.ajax("GET", `/game/${id}/${character}`, undefined, undefined);
    }
}

export const gameService = new GameService();