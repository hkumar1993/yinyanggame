import Pickups from './pickups.js';
import state from './state.js';
import YinYang from './yinyang.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-container');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.yinYang = new YinYang(this.centerX, this.centerY, state.playerRadius);
        this.orbs = {};
        this.countOrbs = 0;
        this.interval = setInterval(() => {
            this.spawnOrb();
        }, 500);

        this.loop();
    }

    spawnOrb() {
        if (this.countOrbs > 100 && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            return;
        }
        const id = this.countOrbs++;
        this.orbs[id] = new Pickups(0, 0, id);
    }

    update() {
        // Check for collisions
        Object.values(this.orbs).forEach((orb) => {
            if (this.yinYang.checkCollision(orb)) orb.handleCollision();
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.yinYang.draw(this.ctx);
        Object.values(this.orbs).forEach((orb) => {
            if (orb.collided) return;
            orb.draw(this.ctx);
        });
    }

    loop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.loop());
    }
}
