import pkg, {Db} from 'mongodb';
const { MongoClient, ObjectID } = pkg;
const connectionURL = 'mongodb://localhost:27017/';
const dbName = 'hangmandb';
import debug from 'debug';
const log = debug("hangman:server");

class DatabaseService {
    // @ts-ignore
    public db: Db;

    constructor() {
        this.connectWithRetry();
    }

    connectWithRetry() {
        MongoClient.connect(connectionURL, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                log("mongodb connection error: " + err);
                log("mongodb connection RETRY");
                setTimeout(() => this.connectWithRetry(), 1000);
                return;
            }
            log("mongodb connection success");
            this.db = client.db(dbName);
            client.on('close', () => {console.log("mongodb connection closed");});
            client.on('error', function(err) { console.log("mongodb error: " + err.message); });
        });
    }
}

export const databaseService = new DatabaseService();
