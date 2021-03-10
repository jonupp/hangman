import pkg from 'mongodb';
const { MongoClient, ObjectID } = pkg;
const connectionURL = 'mongodb://localhost:27017/';
const dbName = 'hangmanDB';

class Database {
    private db;

    constructor() {
        this.connectWithRetry();
    }

    connectWithRetry() {
        MongoClient.connect(connectionURL, (err, client) => {
            if (err) {
                console.log("mongodb connection error: "+err);
                console.log("mongodb connection RETRY");
                setTimeout(() => this.connectWithRetry(), 1000);
                return;
            }
            console.log("mongodb connection success");
            this.db = client.db(dbName);
        });
    }

    async insert(collection, entry) {
        if(this.db) {
            return await this.db.collection(collection).insertOne(entry);
        } else {
            console.log("NOT YET CONNECTED TO DATABASE");
        }
    }

    async update(collection, id, data) {
        if(this.db) {
            return await this.db.collection(collection).updateOne({_id: new ObjectID(id)}, {$set: data});
        } else {
            console.log("NOT YET CONNECTED TO DATABASE");
        }
    }

    async get(collection, filter, sort, limit) {
        if(this.db) {
            return await this.db.collection(collection).find(filter).sort(sort).limit(limit).toArray();
        } else {
            console.log("NOT YET CONNECTED TO DATABASE");
        }
    }
}

export const database = new Database();