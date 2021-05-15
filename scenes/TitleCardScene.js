const WIDTH = 800;
const HEIGHT = 600;
export default class TitleCardScene extends Phaser.Scene {
  constructor() {
    super("TitleCardScene");
  }

  init = () => {
    let element = document.createElement("style");
    document.head.appendChild(element);
    element.sheet.insertRule(
      '@font-face { font-family: "bebas"; src: url("assets/fonts/ttf/bebas.ttf") format("truetype"); }',
      0
    );
  }

  preload = () => {
    this.load.crossOrigin = "anonymous";
    this.load.image("background", "../assets/background3.png");
  }

  create = () => {
    var back = this.add.tileSprite(0, 0, WIDTH, HEIGHT, "background");
    back.setOrigin(0);

    this.add
      .text(720, 0, "G\n R\nA\n n\na\n J\nS", {
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
      "Jest to ekran początkowy do gry Arcadowej",
      'wykonanej we frameworku Phaser.',
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
      .text(20, 300, "Press SPACE to play", {
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
