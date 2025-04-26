import { EVENTS } from './constants.js';
import eventBus from './eventbus.js';

const PICKUP_SOUND_1 = new Audio('./sound/UI_Quirky3.mp3');
const PICKUP_SOUND_2 = new Audio('./sound/UI_Quirky4.mp3');
const BGM = new Audio('./sound/Hypnotic-Puzzle4.mp3');
BGM.loop = true;
BGM.volume = 0.5;

const AUDIO_POOL = [
    PICKUP_SOUND_1.cloneNode(),
    PICKUP_SOUND_1.cloneNode(),
    PICKUP_SOUND_1.cloneNode(),
    PICKUP_SOUND_1.cloneNode(),
]

class Soundboard {
    constructor() {
        this.isMuted = false;
        this.bindEvents();
        this.bgmCanPlay = false;
        BGM.addEventListener('canplaythrough', () => {
            this.bgmCanPlay = true;
            BGM.play();
        });
        this.currentSoundIndex = 0;
    }

    bindEvents() {
        eventBus.subscribe(EVENTS.PICKUP, () => {
            this.playCollision();
        });
    }

    playCollision() {
        if (this.isMuted) {
            return;
        }
        const sound = AUDIO_POOL[this.currentSoundIndex];
        sound.currentTime = 0;
        sound.play();
        this.currentSoundIndex = (this.currentSoundIndex + 1) % AUDIO_POOL.length;
    }

    stopAll() {
        BGM.pause();
        PICKUP_SOUND_1.pause();
        PICKUP_SOUND_2.pause();
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopAll();
        } else {
            if (!this.bgmCanPlay) { return; }
            BGM.play();
        }
    }
}

const soundboard = new Soundboard();
export default soundboard;