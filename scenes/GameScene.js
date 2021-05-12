export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    let ball;
    let paddle;
    let cursors;
    var bricks;
  }

  create() {

    this.ball = this.physics.add.sprite(250, 350, "ball");
    this.ball.setOrigin(0.5, 0.5);
    this.ball.body.velocity.x = 100;
    this.ball.body.velocity.y = -150;
    this.ball.body.setCollideWorldBounds(true);
    this.ball.body.bounce.set(1);

    this.paddle = this.physics.add.sprite(150, 380, "paddle");
    this.paddle.setOrigin(0.5);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.paddle.body.setCollideWorldBounds(true);
    this.paddle.body.immovable = true;

    this.bricks = this.physics.add.staticGroup();
    for (var y = 0; y < 4; ++y) {
      for (var x = 0; x < 7; ++x) {
        let brick = this.bricks.create(40 + x * 36, 80 + y * 40, "brick");
      }
    }
  }

  update() {
    let ball = this.ball
    let paddle = this.paddle
    let cursors = this.cursors
    let bricks = this.bricks

    paddle.body.velocity.x = 0;
    if (cursors.left.isDown) {
      paddle.body.velocity.x = -250;
    } else if (cursors.right.isDown) {
      paddle.body.velocity.x = 250;
    }else if (cursors.space.isDown){
        this.start()
    }

    this.physics.collide(ball, paddle, this.ballHitsPaddle);
    this.physics.collide(ball, bricks, this.ballHitsBrick);
  }

  ballHitsPaddle(ball, paddle) {
    ball.body.velocity.x = 5 * (ball.x - paddle.x);
  }

  ballHitsBrick(ball, brick) {
    brick.disableBody(true, true);
  }

  start() {
    this.scene.start("GameOverScene");
  }
}
