export default class TitleCardScene extends Phaser.Scene {
  constructor() {
    super("TitleCardScene");
  }

  init() {
    let element = document.createElement("style");
    document.head.appendChild(element);
    element.sheet.insertRule(
      '@font-face { font-family: "bebas"; src: url("assets/fonts/ttf/bebas.ttf") format("truetype"); }',
      0
    );
  }

  preload() {
    this.load.crossOrigin = "anonymous";
    this.load.baseURL = "https://examples.phaser.io/assets/";
    this.load.image("ball", "games/breakout/ball.png");
    this.load.image("paddle", "games/breakout/paddle.png");
    this.load.image("brick", "games/breakout/brick1.png");
  }

  create() {
    this.add
      .text(720, 0, "S\n t\na\n c\nk\n e\nr", {
        fontFamily: "bebas",
        fontSize: 74,
        color: "#ffffff",
        lineSpacing: -10,
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.add
      .text(20, 40, "Instructions", {
        fontFamily: "bebas",
        fontSize: 70,
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    var help = [
      "Build a tower all the way to the top of the screen",
      'to win big "prizes"! Place rows of blocks on top',
      "of each other, but be careful: it gets faster each",
      "time, you lose blocks if you don't land perfectly,",
      "and you automatically shrink after rows 5 and 10!",
    ];

    this.add
      .text(20, 180, help, {
        fontFamily: "bebas",
        fontSize: 30,
        color: "#ffffff",
        lineSpacing: 6,
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.add
      .text(20, 450, "Space Bar or Click to Place a Row", {
        fontFamily: "bebas",
        fontSize: 40,
        color: "#ffffff",
      })
      .setShadow(2, 2, "#333333", 2, false, true);

    this.input.keyboard.once("keydown_SPACE", this.start, this);
    this.input.once("pointerdown", this.start, this);
  }


  start() {
    console.log("WUH");
    this.scene.start("GameScene");
  }
}
