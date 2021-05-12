
//CONFIGURATION
import GameOverScene from "./scenes/GameOverScene.js";
import GameScene from "./scenes/GameScene.js";
import TitleCardScene from "./scenes/TitleCardScene.js";

let config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: "48a",
  physics:{
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false
    }
  },
  scene: [TitleCardScene,GameScene,GameOverScene]
};

let game = new Phaser.Game(config);

