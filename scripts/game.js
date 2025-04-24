import Pickups from './pickups.js';
import state from './state.js';
import YinYang from './yinyang.js';
import Timer from './timer.js';
import eventBus from './eventbus.js';
import {EVENTS} from './constants.js';

export default class Game {
    constructor() {
        this.canvas = document.getElementById('game-container');
        this.ctx = this.canvas.getContext('2d');
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        this.yinYang = new YinYang(this.centerX, this.centerY, state.playerRadius);
        this.timer = new Timer();
        this.orbs = {};
        this.countOrbs = 0;
        this.interval = null;
        this.animationInterval = null;
        this.paused = false;
        this.setupEventBindings();
        this.start();
    }

    setupEventBindings() {
        eventBus.subscribe(EVENTS.MENU_OPEN, () => {
            if (this.paused) {
                this.paused = false;
                this.start();
            } else {
                this.paused = true;
                this.pause();
            }
        });
        eventBus.subscribe(EVENTS.GAME_OVER, (message) => {
            console.log(message);
            this.pause();
        });
    }

    spawnOrb() {
        if (this.countOrbs > 1000 && this.interval) {
            clearInterval(this.interval);
            this.interval = null;
            return;
        }
        const edge = Math.floor(Math.random() * 4);
        let x, y;
        switch (edge) {
            case 0: x = Math.random() * this.canvas.width; y = 0; break;
            case 1: x = this.canvas.width; y = Math.random() * this.canvas.height; break;
            case 2: x = Math.random() * this.canvas.width; y = this.canvas.height; break;
            case 3: x = 0; y = Math.random() * this.canvas.height; break;
        }

        const id = this.countOrbs++;
        this.orbs[id] = new Pickups(x, y, id);
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
        this.animationInterval = requestAnimationFrame(() => this.loop());
    }

    start() {
        this.interval = setInterval(() => {
            this.spawnOrb();
        }, 500);

        this.timer.start();
        this.loop();
    }

    pause() {
        clearInterval(this.interval);
        cancelAnimationFrame(this.animationInterval);
        this.interval = null;
        this.animationInterval = null;
        this.timer.pause();
    }
}
