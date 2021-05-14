
export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('GameOverScene');
        var player, platforms;
        var cursors;
    }

    preload = () => {
      this.load.crossOrigin = "anonymous";
      this.load.baseURL = "https://examples.phaser.io/assets/";
      this.load.image("ball", "games/breakout/ball.png");
      this.load.image("paddle", "games/breakout/paddle.png");
      this.load.image("brick", "games/breakout/brick1.png");
    }
  
    create = () => {
      this.add
        .text(20, 180, "The last judgment draweth nigh...", {
          fontFamily: "bebas",
          fontSize: 42,
          color: "#ffffff",
        })
        .setShadow(2, 2, "#333333", 2, false, true);
  
      var help = [
        "Jest to ekran początkowy do gry Arcadowej",
        'wykonanej we frameworku Phaser.',
      ];
  
      this.add
        .text(40, 300, "Press SPACE to play", {
          fontFamily: "bebas",
          fontSize: 40,
          color: "#ffffff",
        })
        .setShadow(2, 2, "#333333", 2, false, true);
  
      this.input.keyboard.on("keydown-SPACE", this.start, this);
    }
  
  
    start = () => {
      this.scene.start("GameScene");
    }

}