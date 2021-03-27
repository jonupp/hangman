import {database} from "./repository/database.js";
import {Player} from "./player.js";
import mongo from "mongodb";

class PlayerStore {
    async add(player : Player) {
        return await database.insert('players', player);
    }

    async get(filter, sort, limit) {
        return await database.get('players', filter, sort, limit);
    }

    async getByPlayerId(id) {
        return (await database.get('players', new mongo.ObjectID(id), {}, 1))[0];
    }

    async update(id, data) {
        return await database.update('players', id, data);
    }
}

export const playerStore = new PlayerStore();