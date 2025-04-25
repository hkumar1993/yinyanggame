import { EVENTS } from './constants.js';
import eventBus from './eventbus.js';
import Game from './game.js';
import { getKeyActionMap, keybinds } from './keybinds.js';
import Menu from './menu.js';

const game = new Game();
const menu = new Menu(game);

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

    if (e.key === 'Escape' && game.started) {
        if (game.paused) {
            eventBus.publish(EVENTS.GAME_RESUME);
        } else {
            eventBus.publish(EVENTS.GAME_PAUSE);
        }
    }
});

document.addEventListener('keyup', (e) => {
    Object.entries(keyActionsMap).forEach(([key, actions]) => {
        if (e.key === key) {
            actions.forEach((action) => eventBus.publish(`${action}_KEYUP`));
        }
    });
});

document.addEventListener('visibilitychange', () => {
    if (game.paused) {
        return;
    }
    eventBus.publish(EVENTS.GAME_PAUSE);
});
