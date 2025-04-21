import Game from './game.js';
import eventBus from './eventbus.js';
import {
    keybinds,
    getKeyActionMap,
} from './keybinds.js';

const keyActionsMap = getKeyActionMap(keybinds);
document.addEventListener('keydown', (e) => {
    Object.entries(keyActionsMap).forEach(([key, actions]) => {
        if (e.key === key) {
            actions.forEach((action) => eventBus.publish(`${action}_KEYDOWN`));
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
new Game();