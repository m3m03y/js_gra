export default class Enemy {
    constructor() {
        this.isDead = true;
        this.health = 50;
    }

    get isDead(){
        return this.isDead;
    }

    kill = () =>{
        this.isDead = true;
    }

    giveDamage() {
        return 20 + Math.floor(Math.random() * 10);
    }
}