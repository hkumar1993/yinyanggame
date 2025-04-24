import {EVENTS} from './constants.js';

export const keybinds = {
    [EVENTS.LEFT]: ['ArrowLeft', 'a'],
    [EVENTS.RIGHT]: ['ArrowRight', 'd'],
};

export const getKeyActionMap = (keybinds) => {
    const map = {};
    Object.entries(keybinds).forEach(([action, keys]) => {
        keys.forEach((key) => {
            if (!map[key]) {
                map[key] = [];
            }
            map[key].push(action);
        });
    });
    return map;
};
