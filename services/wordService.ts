import {wordStore} from "./wordStore.js"

class WordService{
    async getRandomWord(){
        return (await wordStore.getRandomWord()).word;
    }
}

export const wordService = new WordService();
