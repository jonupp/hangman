export class Player{
    username: string;
    passwordHash: string;
    score: number;

    constructor(username: string, score: number, passwordHash: string) {
        this.username = username;
        this.score = score;
        this.passwordHash = passwordHash;
    }
}
