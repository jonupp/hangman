import {database} from "./repository/database.js";
import {Player} from "./player.js";
import mongo from "mongodb";

class PlayerStore {
    async add(player : Player) {
        return await database.db.collection('players').insertOne(player);
    }

    async get(filter, sort, limit) {
        return await database.db.collection('players').find(filter).sort(sort).limit(limit).toArray();
    }

    async getByPlayerId(id) {
        return (await database.db.collection('players').findOne(new mongo.ObjectID(id)));
    }

    async update(id, data) {
        return await database.db.collection('players').updateOne({_id:new mongo.ObjectId(id)},{$set: data});
    }
}

export const playerStore = new PlayerStore();