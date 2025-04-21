import YinYang from './yinyang.js'
import Pickups from './pickups.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById("game-container")
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.yinYang = new YinYang(this.centerX, this.centerY, 100);
        console.log(this.yinYang);
        this.orbs = [];
        this.loop();
    }

    spawnOrb() {
        if (this.orbs.length > 10) {
            return;
        }
        this.orbs.push(new Pickups(0, 0));
    }

    update() {
        // game update logic goes here
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.yinYang.draw(this.ctx);
        this.orbs.forEach((orb) => orb.draw(this.ctx));
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}