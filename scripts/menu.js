import { EVENTS } from './constants.js';
import eventBus from './eventbus.js';
import soundboard from './soundboard.js';
import state from './state.js';
export default class MainMenu {
    constructor(game) {
        this.soundboard = soundboard;
        this.menuElement = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-game');
        this.muteButton = document.getElementById('mute');
        this.resetButton = document.getElementById('reset');
        this.game = game;

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });

        this.muteButton.addEventListener('click', () => {
            this.toggleMute();
        });

        eventBus.subscribe(EVENTS.GAME_PAUSE, () => {
            this.showMenu();
        });
        eventBus.subscribe(EVENTS.GAME_RESUME, () => {
            this.hideMenu();
        });
        eventBus.subscribe(EVENTS.GAME_OVER, () => {
            this.gameOver();
        });
    }

    startGame() {
        this.hideMenu();
        if (!this.game.started) {
            eventBus.publish(EVENTS.GAME_START);
            this.startButton.innerText = 'Resume';
            this.resetButton.classList.remove('hidden');
        } else {
            eventBus.publish(EVENTS.GAME_RESUME);
        }
    }

    toggleMute() {
        this.soundboard.toggleMute();
        this.muteButton.innerText = this.soundboard.isMuted ? 'Unmute' : 'Mute';
    }

    resetGame() {
        this.menuElement.classList.remove('game-over');
        this.startButton.innerText = 'Start Game';
        this.resetButton.classList.add('hidden');
        eventBus.publish(EVENTS.GAME_RESET);
    }

    hideMenu() {
        this.menuElement.classList.add('hidden');
    }

    showMenu() {
        this.menuElement.classList.remove('hidden');
    }

    menuVisible() {
        return !this.menuElement.classList.contains('hidden');
    }

    gameOver() {
        this.menuElement.classList.add('game-over');
        document.getElementById('final-score-time').innerText = state.endTime;
        this.showMenu();
    }
}
