// @ts-ignore
import {database} from "./repository/database.js";

class WordStore {
    async getRandomWord() {
        return (await database.getDb().collection("words").aggregate( [ { $sample: { size: 1 } } ] ).toArray())[0];
    }
}

// @ts-ignore
export const wordStore = new WordStore();