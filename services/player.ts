export class Player{
    name: string;
    passwordHash: string;
    score: number;

    constructor(name, score, passwordHash) {
        this.name = name;
        this.score = score;
        this.passwordHash = passwordHash;
    }
}