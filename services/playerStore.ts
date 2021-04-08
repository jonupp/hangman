import {databaseService} from "./repository/database.js";
import {Player} from "./player.js";
import mongo from "mongodb";

class PlayerStore {
    async add(player: Player) {
        return await databaseService.db.collection('players').insertOne(player);
    }

    async get(filter, sort, limit) {
        return await databaseService.db.collection('players').find(filter).sort(sort).limit(limit).toArray();
    }

    async getPlayerByUsername(username: string){
        return await databaseService.db.collection('players').findOne({username: username});
    }

    async getByPlayerId(id) {
        return await databaseService.db.collection('players').findOne(new mongo.ObjectID(id));
    }

    async update(id, data) {
        return await databaseService.db.collection('players').updateOne({_id:new mongo.ObjectId(id)},{$set: data});
    }
}

export const playerStore = new PlayerStore();
