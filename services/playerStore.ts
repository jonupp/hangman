import {database} from "./repository/database.js";
import {Player} from "./player.js";

//mömer denn no luege, öb die klass wükli nötig isch
class PlayerStore {
    async add(name, score) {
        return await database.insert('players', new Player(name, score));
    }

    async get(filter, sort, limit) {
        return await database.get('players', filter, sort, limit);
    }

    async update(id, data) {
        return await database.update('players', id, data);
    }
}

export const playerStore = new PlayerStore();