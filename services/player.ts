export interface IPlayer {
    name: string,
    score: number
}

export class Player implements IPlayer {
    name: string;
    score: number;

    constructor(name, score) {
        this.name = name;
        this.score = score;
    }
}