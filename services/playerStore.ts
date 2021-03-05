/*
 * Examples how to use PlayerStore:
 * await playerStore.add("newPlayer", 3);
 * const player = await playerStore.get("60413fb86ef094aa66c0574e");
 * playerStore.updateScore("60413faaf63e47a8a3433e1d", 3312);
 */
import {database} from "./repository/database.js";
import {Player, IPlayer} from "./player.js";

class PlayerStore {
    constructor() {
        const playerSchemaFields: Record<keyof IPlayer, any> = {
            name: String,
            score: Number,
        };
        database.addModel(Player.name, playerSchemaFields);
    }

    async add(name, score) {
        await database.insert(Player.name, new Player(name, score));
    }

    async get(id) {
        return await database.find(Player.name, id);
    }

    async getAll(sort, amount) {
        return await database.findMany(Player.name, sort, amount);
    }

    async updateScore(id, score) {
        await database.update(Player.name, id, score);
    }
}

export const playerStore = new PlayerStore();