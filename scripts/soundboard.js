import { EVENTS } from './constants.js';
import eventBus from './eventbus.js';

export default class Soundboard {
    constructor() {
        this.isMuted = false;
        this.audioElements = {
            bgm: document.getElementById('bgm'),
            pickup1: document.getElementById('pickup-1'),
            pickup2: document.getElementById('pickup-2'),
        };
        this.bindEvents();
    }

    bindEvents() {
        eventBus.subscribe(EVENTS.PICKUP, () => {
            this.play('pickup1');
        });

        eventBus.subscribe(EVENTS.GAME_PAUSE, () => {
            this.stopAll();
        });
        eventBus.subscribe(EVENTS.GAME_RESUME, () => {
            this.play('bgm');
        });
        eventBus.subscribe(EVENTS.GAME_START, () => {
            this.play('bgm');
        });
    }

    play(id) {
        if (!this.isMuted) {
            this.audioElements[id].play();
        }
    }

    stop(id) {
        if (!this.isMuted) {
            this.audioElements[id].pause();
        }
    }

    stopAll() {
        if (!this.isMuted) {
            Object.values(this.audioElements).forEach((audio) => audio.pause());
        }
    }
}
