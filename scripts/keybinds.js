export const keybinds = {
    LEFT: ['ArrowLeft', 'a'],
    RIGHT: ['ArrowRight', 'd'],
    OPEN_MENU: ['ESC'],
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
