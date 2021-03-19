export class Player{
    username: string;
    passwordHash: string;
    score: number;

    constructor(username, score, passwordHash) {
        this.username = username;
        this.score = score;
        this.passwordHash = passwordHash;
    }
}