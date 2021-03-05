import pkg from 'mongodb';
const { MongoClient, ObjectID } = pkg;
const connectionURL = 'mongodb://localhost:27017/';
const dbName = 'hangmanDB';

class Database {
    private db;

    constructor() {
        MongoClient.connect(connectionURL, (err, client) => {
            if (err) console.log("mongodb connection error: "+err);
            this.db = client.db(dbName);
            console.log("mongodb connection success");
        });
    }

    async insert(collection, entry) {
        return await this.db.collection(collection).insertOne(entry);
    }

    async update(collection, id, data) {
        return await this.db.collection(collection).updateOne({_id: new ObjectID(id)}, {$set: data});
    }

    async get(collection, filter, sort, limit) {
        return await this.db.collection(collection).find(filter).sort(sort).limit(limit).toArray();
    }
}

export const database = new Database();