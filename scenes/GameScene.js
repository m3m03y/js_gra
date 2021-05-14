export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    var player, platforms;
    var cursors;
    var keys;
    this.lives = 5;
  }

  preload = () => {
    //this.load.baseURL = "https://labs.phaser.io/assets/";
    this.load.crossOrigin = "anonymous";

    this.load.image("background", "https://labs.phaser.io/assets/games/snowmen-attack/background.png");
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/block.png");

    this.load.tilemapTiledJSON("gameMap", "../assets/maps/platformer.json");
    // this.load.image('gameTiles', 'tilemaps/tiles/platformer_tiles.png');
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
    let WIDTH = 800;
    let HEIGHT = 600;

    var back = this.add.tileSprite(0, 28, WIDTH, HEIGHT, "background");
    back.setOrigin(0);
    back.setScrollFactor(0);

    var gameMap = this.add.tilemap("gameMap");
    var tileSet = gameMap.addTilesetImage(
      "platformer_tiles",
      "gameTiles"
    );
    var layer = gameMap.createLayer("Layer1", tileSet, 0, 0);
    
    layer.setScale(HEIGHT / layer.height);
    //collidery z podłożem
    gameMap.setCollision([
      31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 104,105,106,107
    ]);

    this.cameras.main.setBounds(0, 0, layer.x + layer.width + WIDTH, HEIGHT);
    this.physics.world.setBounds(0, 0, layer.x + layer.width + WIDTH, HEIGHT);


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

    this.player = this.physics.add.sprite(50, 100, "player");
    this.player.on("animationrepeat", () => {
      //listen to when an animation completes, then run fly
      this.player.anims.play("idle");
    });

    this.input.keyboard.on("keydown-X", () => {
      console.log("PUNCH");
      this.player.anims.play("punch", true);
    });

    this.input.keyboard.on("keydown-Z", () => {
      console.log("KICK");
      this.player.anims.play("kick", true);
    });

    this.player.setCollideWorldBounds(true);
    this.player.body.onWorldBounds = true;
    this.player.setBounce(0.2);
    this.cameras.main.startFollow(this.player);
    this.physics.world.on("worldbounds", this.gameOver);

    this.cursors = this.input.keyboard.createCursorKeys();
    //this.physics.collide(this.player, layer);
    this.physics.add.collider(this.player, layer);
    // this.platforms = this.physics.add.staticGroup();
    // this.platforms.create(200, 550, "platform");
    // this.platforms.create(300, 500, "platform");
    // this.platforms.create(400, 450, "platform");
    // this.platforms.create(450, 400, "platform");
    // this.platforms.create(500, 350, "platform");
    // this.platforms.create(600, 300, "platform");
    // this.platforms.create(700, 250, "platform");
    // this.platforms
    //   .getChildren()
    //   .forEach((c) => c.setScale(0.5).setOrigin(0).refreshBody());

    //this.physics.add.collider(this.player, this.platforms);
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
      player.setVelocityY(-400);
      player.anims.play("jump", true);
      console.log("Jumped");
    }

    if (cursors.space.isDown) {
      this.start();
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
      console.log("Game Over");
    }
  };
}
