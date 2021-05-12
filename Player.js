export default class Player {
    constructor() {
        this.isDead = false;
        this.isBigState = false;
    }

    get isDead(){
        return this.isDead;
    }

    kill(){
        this.isDead = true;
    }

    makeBig(){
        this.isBigState = true;
    }

    makeSmall(){
        this.isBigState = false;
    }
}