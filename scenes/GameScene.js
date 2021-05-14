const WIDTH = 800;
const HEIGHT = 600;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.lives = 5;
    this.enemies = [];
  }

  preload = () => {
    this.load.crossOrigin = "anonymous";
    this.load.image("background", "https://labs.phaser.io/assets/games/snowmen-attack/background.png");
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/block.png");
    // this.load.animations('gemsData','https://labs.phaser.io/assets/animations/gems.json')
    // this.load.atlas('gems','https://labs.phaser.io/assets/test/columns/gems.png','https://labs.phaser.io/assets/test/columns/gems.json')
    this.load.spritesheet("enemy", "https://labs.phaser.io/assets/animations/nyan/cat.png", {
      frameWidth: 97,
      frameHeight: 56
    });

    this.load.tilemapTiledJSON("gameMap", "../assets/maps/platform.json");
    this.load.image("gameTiles", "../assets/tiles/platformer_tiles.png", {
      frameWidth: 16,
      frameHeight: 16
    });

    this.load.spritesheet("player", "https://labs.phaser.io/assets/animations/brawler48x48.png", {
      frameWidth: 48,
      frameHeight: 49,
    });
  };

  create = () => {

    var back = this.add.tileSprite(0, 28, WIDTH, HEIGHT, "background");
    back.setOrigin(0);
    back.setScrollFactor(0);

    var gameMap = this.add.tilemap("gameMap");
    var tileSet = gameMap.addTilesetImage(
      "platformer_tiles",
      "gameTiles"
    );
    var layer = gameMap.createLayer("Layer", tileSet, 0, 0);

    layer.setScale(HEIGHT / layer.height);
    //collidery z podłożem
    gameMap.setCollision([
      31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 104, 105, 106, 107
    ]);

    this.cameras.main.setBounds(0, 0, layer.x + layer.width + WIDTH, HEIGHT);
    this.physics.world.setBounds(0, 0, layer.x + layer.width + WIDTH, HEIGHT);
    this.physics.world.on("worldbounds", this.gameOver);

    //PLAYER ANIMS
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: 1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 5, end: 8 }),
      frameRate: 8,
      repeat: 1,
    });

    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", { start: 20, end: 23 }),
      frameRate: 16,
      repeat: -1,
    });

    this.anims.create({
      key: "die",
      frames: this.anims.generateFrameNumbers("player", { start: 35, end: 37 }),
      frameRate: 16,
    });

    this.anims.create({
      key: "kick",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [10, 11, 12, 13, 10],
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "punch",
      frames: this.anims.generateFrameNumbers("player", {
        frames: [15, 16, 17, 18, 17, 15],
      }),
      frameRate: 8,
      repeat: -1,
    });

    //ENEMY ANIMS
    this.anims.create({
      key: "evil_walk",
      frames: this.anims.generateFrameNumbers("enemy", {
        start: 0, end: 5
      }),
      frameRate: 16
    })

    this.player = this.physics.add.sprite(50, 100, "player");
    this.player.on("animationrepeat", () => {
      //listen to when an animation completes, then run fly
      this.player.anims.play("idle");
    });


    this.player.setCollideWorldBounds(true,true, false, true);
    this.player.body.onWorldBounds = true;
    this.player.setBounce(0.1);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();


    //Tworzenie przeciwników
    let enemy = this.physics.add.sprite(100, 100, "enemy");
    enemy.body.gravity.y = 500;
    enemy.setCollideWorldBounds(true, true, false, false);
    enemy.body.onWorldBounds = false;
    this.physics.add.collider(enemy, layer);
    enemy.setScale(0.7)
    enemy.setBounce(0.1)
    enemy.anims.play("evil_walk", true);
    this.enemies.push(enemy);
    //Player colliders
    this.physics.add.collider(this.player, layer);
    this.physics.add.collider(this.player, enemy,this.dealDamage);
  };

  update = () => {
    let cursors = this.cursors;
    let player = this.player;
    if (cursors.left.isDown) {
      player.setVelocityX(-150);
      player.flipX = false;
      player.anims.play("walk", true);
    } else if (cursors.right.isDown) {
      player.setVelocityX(150);
      player.flipX = true;
      player.anims.play("walk", true);
    } else {
      player.setVelocityX(0);
    }

    if (
      cursors.up.isDown &&
      (player.body.touching.down || player.body.onFloor())
    ) {
      player.setVelocityY(-300);
      player.anims.play("jump", true);
      console.log("Jumped");
    }

    if (cursors.space.isDown) {
      this.start();
    }

    // if (this.enemies[0].body.onFloor()){
    //   console.log("Nyan cat dead");
    //   //this.enemies[0].Destroy();
    // }
    if(this.player.body.onFloor() && this.player.body.y == HEIGHT){
      console.log(this.player.body.y)
      //this.gameOver();
    }
  };

  start = () => {
    this.scene.start("TitleCardScene");
  };

  gameOver = (ball, up, down, left, right) => {
    let lives = this.lives;
    if (down && lives != 0) {
      this.lives -= 1;
      console.log(lives);
    }
    if (this.lives == 0) {
      this.scene.start("GameOverScene")
    }if(down && this.lives > 0){
      let lives_left = this.lives
      this.registry.destroy()
      this.events.off()
      this.scene.restart()
      this.lives = lives_left
    }
  };

  dealDamage = () =>{

    this.input.keyboard.on("keydown-Z", () => {
      console.log("Damage Dealt With kick");
      this.player.anims.play("kick", true);
    });

    this.input.keyboard.on("keydown-X", () => {
      console.log("PUNCH");
      this.player.anims.play("punch", true);
    });

  }

}
