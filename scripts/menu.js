import eventBus from "./eventbus.js";
import { EVENTS } from "./constants.js";

export default class MainMenu {
    constructor(game) {
        this.menuElement = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-game');
        this.game = game;

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

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
        } else {
            eventBus.publish(EVENTS.GAME_RESUME);
        }
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