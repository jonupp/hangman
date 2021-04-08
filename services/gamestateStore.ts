import {databaseService} from "./repository/database.js";
import {Gamestate} from "./gamestate";
import mongo from "mongodb"

class GamestateStore {
    async add(gamestate: Gamestate) {
        return await databaseService.db.collection('gamestates').insertOne(gamestate);
    }

    async getById(id: string) {
        return await databaseService.db.collection('gamestates').findOne(new mongo.ObjectID(id));
    }

    async update(id: string, data) {
        return await databaseService.db.collection('gamestates').updateOne({_id:new mongo.ObjectId(id)}, {$set: data});
    }
}

export const gamestateStore = new GamestateStore();
