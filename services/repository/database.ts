import pkg, {Db} from 'mongodb';
const { MongoClient, ObjectID } = pkg;
const connectionURL = 'mongodb://localhost:27017/';
const dbName = 'hangmandb';

class DatabaseService {
    // @ts-ignore
    public db: Db;

    constructor() {
        this.connectWithRetry();
    }

    connectWithRetry() {
        MongoClient.connect(connectionURL, (err, client) => {
            if (err) {
                console.log("mongodb connection error: " + err);
                console.log("mongodb connection RETRY");
                setTimeout(() => this.connectWithRetry(), 1000);
                return;
            }
            console.log("mongodb connection success");
            this.db = client.db(dbName);
            this.db.on('close', () => {console.log("mongodb connection closed");});
            this.db.on('reconnect', () => {console.log("mongodb reconnected");});
            this.db.on('error', function(err) { console.log("mongodb error: " + err.message); });
        });
    }
}

export const database = new DatabaseService();
