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
        orbSpawnTime: 2000,
        orbSpeed: 3,
    },
    {
        time: 30_000, 
        orbSpawnTime: 1500,
        orbSpeed: 3,
    },
    {
        time: 60_000, 
        orbSpawnTime: 1000,
        orbSpeed: 3,
    },
    {
        time: 120_000, 
        orbSpawnTime: 800,
        orbSpeed: 4,
    },
    {
        time: 180_000, 
        orbSpawnTime: 600,
        orbSpeed: 4,
    },
    {
        time: 240_000, 
        orbSpawnTime: 400,
        orbSpeed: 5,
    },
]);

export const isLocal = () => {
    return window.location.hostname.includes('localhost');
}