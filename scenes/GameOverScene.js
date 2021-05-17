const WIDTH = 800;
const HEIGHT = 600;
export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("GameOverScene");
    this.lives = 0;
    this.score = 0;
    this.isWin = false;
  }

  init = (data) => {
    this.lives = data.lives;
    this.score = data.score + 50 * this.lives;
    this.isWin = data.isWin;
    console.log(
      `Życia: ${this.lives} Wynik: ${this.score} Czy wygrana: ${this.isWin}`
    );
  };

  preload = () => {
    this.load.crossOrigin = "anonymous";
    this.load.image("background3", "../assets/game_over_background.png");
  };

  create = () => {
    let isWin = this.isWin;
    let background = isWin ? "background" : "background3";
    let card = isWin ? "WINNER" : "GAME OVER";
    var back = this.add.tileSprite(0, 0, WIDTH, HEIGHT, background);
    let info = `Życia: ${this.lives}\nWynik: ${this.score}`;
    back.setOrigin(0);

    this.add
      .text(200, 140, card, {
        fontFamily: "Sans-serif",
        fontSize: 42,
        color: "#ff0000",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.add
      .text(40, 300, info, {
        fontFamily: "Sans-serif",
        fontSize: 24,
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.add
      .text(40, 500, "Wciśnij SPACJĘ aby grać", {
        fontFamily: "Sans-serif",
        fontSize: 40,
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.input.keyboard.on("keydown-SPACE", this.start, this);
  };

  start = () => {
    this.scene.start("GameScene", { isReset: true });
  };
}
