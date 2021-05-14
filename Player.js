export default class Player {
    constructor() {
        this.isDead = false;
        this.isBigState = false;
        this.maxHealth = 100;
        this.health = this.maxHealth;
    }

    get isDead(){
        return this.isDead;
    }

    kill(){
        this.isDead = true;
    }

    getDamage(dmg) {
        if (typeof dmg === 'number') {
            if (this.health < dmg) {
                this.health = 0;
                this.kill();
            } else {
                this.health = this.health - dmg;
            }
        }
        
    }
}