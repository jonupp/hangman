import {wordStore} from "./wordStore.js"

class WordService{

    async getRandomWord(): Promise<string> {
        return (await wordStore.getRandomWord()).word.toLowerCase();
    }
}

export const wordService = new WordService();
