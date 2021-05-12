export default class Enemy {
    constructor() {
        this.isDead = true;
    }

    get isDead(){
        return this.isDead;
    }

    kill(){
        this.isDead = true;
    }
}