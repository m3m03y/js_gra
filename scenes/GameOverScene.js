export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('GameOverScene');
        var player, platforms;
        var cursors;
    }

    preload = () => {
        this.load.baseURL = 'https://examples.phaser.io/assets/';
        this.load.crossOrigin = 'anonymous';
        this.load.image('background', 'games/starstruck/background2.png');
        this.load.image('platform', 'sprites/block.png');
      
        this.load.spritesheet('player',
          'games/starstruck/dude.png',
          { frameWidth: 32, frameHeight: 48 }
        );
      }

    create = () =>
    {
        let WIDTH = 800
        let HEIGHT = 600
        let back = this.add.tileSprite(0, 28, WIDTH, HEIGHT, 'background');
        back.setOrigin(0)
        back.setScrollFactor(0);//fixedToCamera = true;
        this.cameras.main.setBounds(0, 0, WIDTH, HEIGHT);
        this.physics.world.setBounds(0, 0, WIDTH, HEIGHT);
      
        this.player = this.physics.add.sprite(50, 100, 'player');
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.cameras.main.startFollow(this.player)
      
        this.anims.create({
          key: 'left',
          frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
          frameRate: 10,
          repeat: -1
        });
      
        this.anims.create({
          key: 'front',
          frames: [{ key: 'player', frame: 4 }],
          frameRate: 20
        });
      
        this.anims.create({
          key: 'right',
          frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
          frameRate: 10,
          repeat: -1
        });
      
        this.cursors = this.input.keyboard.createCursorKeys();
      
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(200, 550, 'platform');
        this.platforms.create(300, 500, 'platform');
        this.platforms.create(400, 450, 'platform');
        this.platforms.create(450, 400, 'platform');
        this.platforms.create(500, 350, 'platform');
        this.platforms.create(600, 300, 'platform');
        this.platforms.create(700, 250, 'platform');
        this.platforms.getChildren().forEach(c => c.setScale(0.5).setOrigin(0).refreshBody())
      
        this.physics.add.collider(this.player, this.platforms);

    
    }

    update = () => {
        let cursors = this.cursors
        let player = this.player

        if (cursors.left.isDown) {
          player.setVelocityX(-150);
          player.anims.play('left', true);
        }
        else if (cursors.right.isDown) {
          player.setVelocityX(150);
          player.anims.play('right', true);
        }
        else {
          player.setVelocityX(0);
          player.anims.play('front');
        }
        
        if (cursors.up.isDown && (player.body.touching.down || player.body.onFloor())) {
          player.setVelocityY(-250);
        }

        if(cursors.space.isDown){
            this.start()
        }

      }

    start = () =>
    {
        this.scene.start('TitleCardScene');
    }

}