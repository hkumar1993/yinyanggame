import { updateScoreValue } from './ui.js';
import { TIMER_LEVELS, EVENTS } from './constants.js';
import eventBus from './eventbus.js';

export default class Timer {
    constructor() {
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.interval = null;
        this.nextLevel = 0;
    }

    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.startTime = performance.now() - this.elapsed;

        this.interval = requestAnimationFrame(() => this.update());
    }

    pause() {
        if (!this.running) {
            return;
        }
        this.running = false;
        cancelAnimationFrame(this.interval);
        this.elapsed = performance.now() - this.startTime;
    }

    stop() {
        if (!this.running) {
            return;
        }
        this.running = false;
        cancelAnimationFrame(this.interval);
        this.elapsed = performance.now() - this.startTime;
    }

    reset() {
        this.running = false;
        cancelAnimationFrame(this.interval);
        this.elapsed = 0;
        this.startTime = null;
        this.displayTime(0);
    }

    update() {
        if (!this.running) {
            return;
        }
        const currentTime = performance.now();
        this.elapsed = currentTime - this.startTime;
        const ms = this.getDisplayTime(this.elapsed);
        this.interval = requestAnimationFrame(() => this.update());
        updateScoreValue('timer', ms);
        this.checkLevelProgression();
    }

    getDisplayTime(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const milliseconds = Math.floor(ms % 1000);

        return `${this.pad(minutes)}:${this.pad(seconds)}:${this.padMilliseconds(milliseconds)}`;
    }

    pad(num) {
        return num.toString().padStart(2, '0');
    }

    padMilliseconds(num) {
        return num.toString().padStart(3, '0');
    }

    reset() {
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.interval = null;
        this.nextLevel = 0;
        updateScoreValue('timer', this.getDisplayTime(0));
    }

    checkLevelProgression() {
        const nextLevel = TIMER_LEVELS[this.nextLevel];
        if (nextLevel && this.elapsed >= nextLevel.time) {
            eventBus.publish(EVENTS.NEXT_LEVEL, this.nextLevel);
            this.nextLevel += 1;
        }
    }
}
