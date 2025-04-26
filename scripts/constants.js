export const COLORS = Object.freeze({
    BLACK: 'black',
    WHITE: 'white',
});

export const EVENTS = Object.freeze({
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    GAME_START: 'GAME_START',
    GAME_PAUSE: 'GAME_PAUSE',
    GAME_RESUME: 'GAME_RESUME',
    GAME_OVER: 'GAME_OVER',
    GAME_RESET: 'GAME_RESET',
    PICKUP: 'PICKUP',
    NEXT_LEVEL: 'NEXT_LEVEL',
});

export const TIMER_LEVELS = Object.freeze([
    {
        time: 0, 
        orbSpawnTime: 3000,
        orbSpeed: 1,
        rotationSpeed: 0.05,
    },
    {
        time: 30_000, 
        orbSpawnTime: 2000,
        orbSpeed: 1,
        rotationSpeed: 0.1,
    },
    {
        time: 60_000, 
        orbSpawnTime: 1000,
        orbSpeed: 1,
        rotationSpeed: 0.1,
    },
    {
        time: 120_000, 
        orbSpawnTime: 800,
        orbSpeed: 1,
        rotationSpeed: 0.2,
    },
    {
        time: 180_000, 
        orbSpawnTime: 600,
        orbSpeed: 2,
        rotationSpeed: 0.2,
    },
    {
        time: 240_000, 
        orbSpawnTime: 300,
        orbSpeed: 2,
        rotationSpeed: 0.2,
    },
])