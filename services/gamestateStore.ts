import {database} from "./repository/database.js";
import {Gamestate} from "./gamestate";

class GamestateStore{
    async add(gamestate : Gamestate) {
        return await database.insert('gamestates', gamestate);
    }

    async get(filter, sort, limit) {
        return await database.get('gamestates', filter, sort, limit);
    }

    async update(id, data) {
        return await database.update('gamestates', id, data);
    }
}

export const gamestateStore = new GamestateStore();