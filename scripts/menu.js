import { EVENTS } from './constants.js';
import eventBus from './eventbus.js';
import soundboard from './soundboard.js';
import state from './state.js';

const TUTORIAL_SCREENS = [
    {
        id: 'bal',
        text: 'Keep the world in balance. Rotate the symbol to collect the dark and light energies of the world.',
    },
    {
        id: 'dol1',
        text: 'Collect dark energy on the dark side. Don\'t let the dark side take over its inner light.',
    },
    {
        id: 'lod2',
        text: 'Collect light energy on the dark side. Don\'t let the light take over the dark side.',
    },
    {
        id: 'lod1',
        text: 'Collect light energy on the dark side. Don\'t let the light side take over its inner dark.',
    },
    {
        id: 'dol2',
        text: 'Collect dark energy on the light side. Don\'t let the dark take over the light side.',
    },
]

export default class MainMenu {
    constructor(game) {
        this.soundboard = soundboard;
        this.menuElement = document.getElementById('main-menu');
        this.startButton = document.getElementById('start-game');
        this.muteButton = document.getElementById('mute');
        this.resetButton = document.getElementById('reset');
        this.tutorialButton = document.getElementById('tutorial');
        this.game = game;
        this.tutorialStep = 0;
        this.showingTutorial = false;

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.showingTutorial) {
                this.endTutorial();
            }
        })

        this.startButton.addEventListener('click', () => {
            this.startGame();
        });

        this.resetButton.addEventListener('click', () => {
            this.resetGame();
        });

        this.muteButton.addEventListener('click', () => {
            this.toggleMute();
        });
        this.tutorialButton.addEventListener('click', () => {
            this.startTutorial();
        });
        this.leftTut = document.getElementById('left-tut');
        this.rightTut = document.getElementById('right-tut');
        this.closeTut = document.getElementById('close-tut');

        this.leftTut.addEventListener('click', () => {
            console.log('prev')
            this.updateTutorialStep(-1);
        });
        this.rightTut.addEventListener('click', () => {
            console.log('next')
            this.updateTutorialStep(1);
        });
        this.closeTut.addEventListener('click', () => {
            this.endTutorial();
        })



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

    startTutorial() {
        const tutorialUI = document.getElementById('tutorial-ui');
        tutorialUI.classList.remove('hidden');
        this.tutorialStep = 0;
        this.updateTutorialStep(0);
        this.showingTutorial = true;
    }

    endTutorial() {
        TUTORIAL_SCREENS.forEach(({id}) => document.getElementById(id)?.classList.add('hidden'));
        document.getElementById('tutorial-ui').classList.add('hidden');
        this.showingTutorial = false;
    }

    updateTutorialStep(change) {
        const prevScreen = TUTORIAL_SCREENS[this.tutorialStep];
        const prevImg = document.getElementById(prevScreen.id);
        console.log({prevScreen, prevImg})
        prevImg.classList.add('hidden');

        this.tutorialStep += change;
        if (this.tutorialStep === 0) {
            // disable left tut
            this.leftTut.setAttribute('disabled', true);
        } else {
            this.leftTut.removeAttribute('disabled');
        }
        if (this.tutorialStep === TUTORIAL_SCREENS.length - 1) {
            this.rightTut.setAttribute('disabled', true);
        } else {
            this.rightTut.removeAttribute('disabled');
        }

        const screen = TUTORIAL_SCREENS[this.tutorialStep];
        const img = document.getElementById(screen.id);
        img.classList.remove('hidden');

        const text = document.getElementById('tutorial-text');
        text.innerText = screen?.text;
    }


}
