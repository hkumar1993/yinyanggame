import { updateScoreValue } from './ui.js';

export default class Timer {
    constructor() {
        this.startTime = null;
        this.elapsed = 0;
        this.running = false;
        this.interval = null;
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
        this.interval = requestAnimationFrame(this.update.bind(this));
        const ms = this.getDisplayTime(this.elapsed);
        updateScoreValue('timer', ms);
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
        updateScoreValue('timer', this.getDisplayTime(0));
    }
}
