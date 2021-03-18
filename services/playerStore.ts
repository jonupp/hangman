import {database} from "./repository/database.js";
import {Player} from "./player.js";

class PlayerStore {
    async add(player : Player) {
        return await database.insert('players', player);
    }

    async get(filter, sort, limit) {
        return await database.get('players', filter, sort, limit);
    }

    async update(id, data) {
        return await database.update('players', id, data);
    }
}

export const playerStore = new PlayerStore();