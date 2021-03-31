import {databaseService} from "./repository/database.js";
import {Gamestate} from "./gamestate";
import mongo from "mongodb"

class GamestateStore {
    async add(gamestate : Gamestate) {
        return await databaseService.db.collection('gamestates').insertOne(gamestate);
    }

    async get(filter, sort, limit) {
        return await databaseService.db.collection('gamestates').find(filter).sort(sort).limit(limit).toArray();
    }

    async update(id, data) {
        return await databaseService.db.collection('gamestates').updateOne({_id:new mongo.ObjectId(id)}, {$set: data});
    }
}

export const gamestateStore = new GamestateStore();