const WIDTH = 800;
const HEIGHT = 600;
export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.baseLives = 3;
    this.lives = 3;
    this.playerHP;
    this.lastAttackTimer = 1000
    this.gemsLoc = [];
    this.kick_key;
    this.punch_key;
    this.enemies_pos_x = [65, 1132, 1962, 2634, 3667];
    this.enemies_pos_y = [515, 470, 320, 395, 396];
    this.score = 0;
    this.last_death_pos_y = 100;
    this.last_death_pos_x = 50;
    this.instruction = "X - PUNCH, Z - KICK, ESC - EXIT";
  }

  preload = () => {
    this.load.crossOrigin = "anonymous";

    this.load.bitmapFont("pixelFont", "assets/font.png", "assets/font.xml");
    this.load.image("platform", "https://labs.phaser.io/assets/sprites/block.png");
    this.load.image('gem', 'https://labs.phaser.io/assets/sprites/gem.png');
    this.load.image('healthPickUp', 'https://labs.phaser.io/assets/sprites/apple.png');
    this.load.image('winKey', 'https://labs.phaser.io/assets/sprites/donut.png');
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
    console.log(this.time)
    var back = this.add.tileSprite(0, -40, WIDTH, HEIGHT, "background");
    back.setOrigin(0);
    back.setScrollFactor(0);

    var gameMap = this.add.tilemap("gameMap");
    var tileSet = gameMap.addTilesetImage(
      "platformer_tiles",
      "gameTiles"
    );
    var layer = gameMap.createLayer("Layer", tileSet, 0, 0);
    let scale = HEIGHT / layer.height;
    layer.setScale(scale);
    //collidery z podłożem
    gameMap.setCollision([
      31, 32, 33, 34, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 104, 105, 106, 107
    ]);

    this.cameras.main.setBounds(0, 0, layer.width * scale, HEIGHT);
    this.physics.world.setBounds(0, 0, layer.width * scale, HEIGHT);
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

    this.player = this.physics.add.sprite(this.last_death_pos_x, this.last_death_pos_y, "player");
    this.player.health = 100;
    this.player.setDepth(1);
    this.player.anims.play("idle");
    this.player.on("animationrepeat", () => {
      //listen to when an animation completes, then run fly
      this.player.anims.play("idle");
    });


    this.player.setCollideWorldBounds(true, true, false, true);
    this.player.body.onWorldBounds = true;
    this.player.setBounce(0.1);
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.enemies = this.physics.add.group();
    //Tworzenie przeciwników
    for (let i = 0; i < this.enemies_pos_x.length; i++) {
      let enemy = this.physics.add.sprite(this.enemies_pos_x[i], this.enemies_pos_y[i], "enemy");
      enemy.health = 100;
      enemy.immovable = true
      enemy.body.gravity.y = 500;
      enemy.setCollideWorldBounds(true, true, false, false);
      enemy.body.onWorldBounds = false;
      this.physics.add.collider(enemy, layer, this.enemyAI);
      enemy.setScale(0.7)
      enemy.setBounce(0.1)
      this.enemies.add(enemy);
    }

    //this.enemies.push(enemy);
    console.log(this.lives);

    if (this.lives == this.baseLives) {
      for (let i = 100; i < layer.width; i += 150) this.gemsLoc.push(i);
    }

    this.gems = this.physics.add.group();

    //Create gems
    for (let i = 0; i < this.gemsLoc.length; i++) {
      let gem = this.physics.add.sprite(this.gemsLoc[i], 200, "gem");
      this.gems.add(gem);
    }

    this.gems.children.iterate(function (child) {
      child.setBounceY(Phaser.Math.FloatBetween(0.1, 0.3));
      child.setScale(0.3)
    })

    //Key to win
    this.winKey = this.physics.add.sprite(4425,510,"winKey");
    this.winKey.setScale(0.2);
    this.physics.add.collider(this.winKey, layer);
    this.physics.add.collider(this.winKey, this.player, this.win);
    
    //Gems colliders
    this.physics.add.collider(this.gems, layer);
    this.physics.add.collider(this.gems, this.player, this.collectGem);

    //Player colliders
    this.physics.add.collider(this.player, layer);
    this.physics.add.overlap(this.player, this.enemies, this.dealDamage, null, this);

    //Enemy battle system
    this.input.keyboard.on("keydown-Z", () => {
      this.player.anims.play("kick", true);
    });

    this.input.keyboard.on("keydown-X", () => {
      this.player.anims.play("punch", true);
    });

    this.punch_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.kick_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    

    this.input.keyboard.on("keydown-I", () => {
      this.instructionText.visible = true;
    });

    this.input.keyboard.on("keyup-I", () => {
      this.instructionText.visible = false;
    });

    this.input.keyboard.on("keydown-ESC", () => {
      this.start();
    });
    
    //DEBUG ONLY
    this.input.keyboard.on("keydown-Y", () => {
      console.log("X: " + this.player.x + " Y:" + this.player.y);
    });    
    
    this.input.keyboard.on("keydown-E", () => {
      this.player.x = 4315;
      this.player.y = 510;
    });

    //Score text
    var style = {
      fontFamily: "Sans-serif",
      fontSize:"24px",
      fill: "#000000",
      align: "center"
    }

    this.scoreText = this.add.text(16, 16, "Score:", style);
    this.playerHP = this.add.text(16,40,"HP:",style)
    this.livesText = this.add.text(16, 64, "Lives:", style);
    this.instructionText = this.add.text(WIDTH/2 - this.instruction.length, 16, this.instruction, style);
    this.updateText();

    //tekst podążą za kamerą
    this.scoreText.setScrollFactor(0);
    this.livesText.setScrollFactor(0);
    this.playerHP.setScrollFactor(0);
    this.instructionText.setScrollFactor(0);
    this.instructionText.visible = false;
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
    //TODO ANIMACJE WROGA
    this.enemies.children.iterate(function (child) {
      child.anims.play("evil_walk", true);
    })

    if (
      cursors.up.isDown &&
      (player.body.touching.down || player.body.onFloor())
    ) {
      player.setVelocityY(-300);
      player.anims.play("jump", true);
      console.log("Jumped");
    }
  };

  start = () => {
    this.resetStats();
    this.scene.start("TitleCardScene");
  };

  gameOver = (ball, up, down, left, right) => {
    let lives = this.lives;
    if ((this.player.health <=0 || down) && lives != 0) {
      this.lives -= 1;
      console.log(lives);
    }
    if (this.lives == 0) {
      //reset lives and score
      this.resetStats();
      this.scene.start("GameOverScene",{ score: this.score, isWin: false, lives: this.lives })
    }
    if ((this.player.health <=0 || down) && this.lives > 0) {
      let lives_left = this.lives
      let death_pos_x = this.player.x - 100
      this.registry.destroy()
      this.events.off()
      this.scene.restart()
      this.last_death_pos_x = death_pos_x
      this.player.healt = 100;
      this.lives = lives_left
    }
    this.updateText();
  };

  dealDamage = (player,enemy) => {


    if(Phaser.Input.Keyboard.JustDown(this.kick_key)){
      if(enemy.health <=0){
        enemy.destroy()
        this.score += 50
      }else{
        enemy.health -=35;
      }
    }
    if(Phaser.Input.Keyboard.JustDown(this.punch_key)){
      if(enemy.health <=0){
        enemy.destroy()
        this.score += 50
      }else{
        enemy.health -=25;
      }
    }

    if(this.time.now - this.lastAttackTimer > 1000 ){
      this.player.health -= Phaser.Math.Between(0,30)
      this.lastAttackTimer = this.time.now
        this.updateText()
      if(this.player.health <= 0){
        this.gameOver()
      }
    }

  }

  win = (player, winKey) => {
    console.log("WINNER!!!");
    this.scene.start("GameOverScene", { score: this.score, isWin: true, lives: this.lives });
    this.last_death_pos_x = 50
  }

  collectGem = (player, star) => {
    this.gemsLoc.splice(this.gemsLoc.indexOf(star.x), 1);
    star.destroy(true, true);
    this.score += 10;
    this.updateText();
    console.log("SCORE: " + this.score, "scoreText: " + this.scoreText.getText)
  }

  updateText = () => {
    this.scoreText.setText('Score: ' + this.score);
    this.livesText.setText('Lives: ' + this.lives);
    this.playerHP.setText('HP: ' + this.player.health + "/100");
  }

  resetStats = () => {
    this.lives = 5;
    this.score = 0;
  }

  enemyAI = (enemy, platform) => {
    
    if(Phaser.Math.Distance.BetweenPoints(enemy,this.player) < 200 ){
      if(enemy.body.velocity.x < 0){
        enemy.flipX=true
      }else{
        enemy.flipX = false
      }
      this.physics.moveToObject(enemy,this.player,120)
    }

  }

}
