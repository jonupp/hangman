import {databaseService} from "./repository/database.js";

class WordStore {
    async getRandomWord() {
        return (await databaseService.db.collection("words").aggregate( [ { $sample: { size: 1 } } ] ).toArray())[0];
    }
}

export const wordStore = new WordStore();
