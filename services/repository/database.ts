import pkg, {Db} from 'mongodb';
const { MongoClient } = pkg;
import debug from 'debug';
const log = debug("hangman:server");

class DatabaseService {
    // @ts-ignore
    public db: Db;

    constructor() {
        this.connectWithRetry();
    }

    connectWithRetry() {
        MongoClient.connect(process.env.CONNECTIONURL!, { useUnifiedTopology: true }, (err, client) => {
            if (err) {
                log("mongodb connection error: " + err);
                log("mongodb connection RETRY");
                setTimeout(() => this.connectWithRetry(), 1000);
                return;
            }
            log("mongodb connection success");
            this.db = client.db(process.env.DBNAME);
            client.on("close", () => {log("mongodb connection closed");});
            client.on("error", function(err) { log("mongodb error: " + err.message); });
        });
    }
}

export const databaseService = new DatabaseService();
