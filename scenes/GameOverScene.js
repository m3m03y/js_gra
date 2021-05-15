const WIDTH = 800;
const HEIGHT = 600;
export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('GameOverScene');
        var player, platforms;
        var cursors;
    }

    preload = () => {
      this.load.crossOrigin = "anonymous";
      this.load.image("background3", "../assets/game_over_background.png");
    }
  
    create = () => {
      var back = this.add.tileSprite(0, 0, WIDTH, HEIGHT, "background3");
      back.setOrigin(0);
      
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