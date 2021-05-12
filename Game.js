export default class Game {
    constructor() {
        this.lifes = 3;
        this.score = 0;
    }

    addLife(){
        this.lifes++;
    }

    removeLife(){
        this.lifes--;
    }

    addScore(){
        this.score++;
    }

    removeScore(){
        this.score--;
    }
}