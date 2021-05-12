export default class CorrectCharacter {
    private readonly char: string;
    private readonly positions: Array<number>;

    constructor(char: string, positions: Array<number>){
        this.char = char;
        this.positions = positions;
    }

    addPosition(index: number){
        this.positions.push(index)
    }

    getChar(){
        return this.char;
    }

    getPositions(){
        return this.positions;
    }
}

