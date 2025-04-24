import eventBus from "./eventbus.js";
import { EVENTS } from "./constants.js";

export default class MainMenu {
    constructor(game) {
        this.menuElement = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-game');
        this.resetButton = document.getElementById('reset');
        this.game = game;

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        })

        eventBus.subscribe(EVENTS.GAME_PAUSE, () => {
            this.showMenu();
        })
        eventBus.subscribe(EVENTS.GAME_RESUME, () => {
            this.hideMenu();
        })
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

    resetGame() {
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
}