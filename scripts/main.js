import Game from './game.js';
import eventBus from './eventbus.js';
import {
    keybinds,
    getKeyActionMap,
} from './keybinds.js';
import { EVENTS } from './constants.js';

const keyActionsMap = getKeyActionMap(keybinds);
document.addEventListener('keydown', (e) => {
    Object.entries(keyActionsMap).forEach(([key, actions]) => {
        if (e.key === key) {
            actions.forEach((action) => {
                // for events that don't need to track keydown/keyup
                eventBus.publish(`${action}`);
                // for events (like arrow keys) that track keydown/keyup
                eventBus.publish(`${action}_KEYDOWN`);
            });
        }
    });
});

document.addEventListener('keyup', (e) => {
    Object.entries(keyActionsMap).forEach(([key, actions]) => {
        if (e.key === key) {
            actions.forEach((action) => eventBus.publish(`${action}_KEYUP`));
        }
    });
});


console.log("Entering game")
const game = new Game();

document.addEventListener('visibilitychange', () => {
    if (game.paused) {
        return;
    }
    eventBus.publish(EVENTS.GAME_PAUSE);
})