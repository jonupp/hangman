class WordService{
    words : Array<string>

    constructor(){
        this.words = ["apple", "tree", "house"];
    }

    async getRandomWord(){
        return this.words[0];
    }
}

export const wordService = new WordService();