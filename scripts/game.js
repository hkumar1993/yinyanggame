import Pickups from './pickups.js';
import YinYang from './yinyang.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-container');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.yinYang = new YinYang(this.centerX, this.centerY, 100);
        console.log(this.yinYang);
        this.orbs = [];
        this.loop();
        this.orbSpawnRate = 1000;
        this.orbSpawnTimer = 0;
    }

    spawnOrb() {
        if (this.orbs.length > 10) {
            return;
        }
        this.orbs.push(new Pickups(0, 0));
    }

    update() {
        // game update logic goes here
        this.orbSpawnTimer++;
        if (this.orbSpawnTimer > this.orbSpawnRate) {
            this.spawnOrb();
            this.orbSpawnTimer = 0;
        }

        // Check for collisions
        this.orbs = this.orbs.filter((orb) => {
            if (this.yinYang.checkCollision(orb)) {
                // Handle collision - for now just remove the orb
                return false;
            }
            return true;
        });
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
