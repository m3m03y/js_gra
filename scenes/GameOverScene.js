export default class GameOverScene extends Phaser.Scene {

    constructor ()
    {
        super('GameOverScene');
    }

    create ()
    {
        this.add.image(400, 300, 'bg');
        this.add.image(400, 430, 'grid').setDisplaySize(800, 376);

        this.add.text(720, 0, 'S\n t\na\n c\nk\n e\nr', { fontFamily: 'bebas', fontSize: 74, color: '#ffffff', lineSpacing: -10 }).setShadow(2, 2, "#333333", 2, false, true);

        this.add.text(20, 40, 'Instructions', { fontFamily: 'bebas', fontSize: 70, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);

        var help = [
            "Game OVER!"
        ];

        this.add.text(20, 180, help, { fontFamily: 'bebas', fontSize: 30, color: '#ffffff', lineSpacing: 6 }).setShadow(2, 2, "#333333", 2, false, true);

        this.add.text(20, 450, 'Space Bar or Click to Place a Row', { fontFamily: 'bebas', fontSize: 40, color: '#ffffff' }).setShadow(2, 2, "#333333", 2, false, true);

        this.input.keyboard.once('keydown_SPACE', this.start, this);
        this.input.once('pointerdown', this.start, this);
    }

    start ()
    {
        this.scene.start('TitleCardScene');
    }

}