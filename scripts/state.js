import { updateScoreValue } from './ui.js';
import { COLORS } from './constants.js';

const INITIAL_STATE = {
    playerLocation: [0, 0],
    playerRadius: 100,
    totalScore: 0,
    levelScore: [],
    currentLevel: 1,
    imbalancedYin: 0,
    imbalancedYang: 0,
}

// Basic GameState object, not doing any redux or things for now
const state = {
    ...INITIAL_STATE
};

export default state;

export const increaseImbalance = (side, increment) => {
    if (side === COLORS.BLACK) {
        state.imbalancedYang = state.imbalancedYang + increment;
        updateScoreValue('imbalanced-yang', state.imbalancedYang);
    } else {
        state.imbalancedYin = state.imbalancedYin + increment; 
        updateScoreValue('imbalanced-yin', state.imbalancedYin);
    }
}

export const increaseScore = (increment) => {
    const currentLevel = state.currentLevel;
    const currentScore = state.levelScore[currentLevel - 1];
    state.levelScore[currentLevel - 1] = currentScore + increment;

    state.totalScore = state.totalScore + increment;
    updateScoreValue('total-score', state.totalScore);
}

export const resetState = () => {
    Object.entries(INITIAL_STATE).forEach(([key, value]) => {
        state[key] = value;
    })
    updateScoreValue('total-score', state.totalScore);
    updateScoreValue('imbalanced-yang', state.imbalancedYang);
    updateScoreValue('imbalanced-yin', state.imbalancedYin);
    updateScoreValue('timer', '00:00:000');
}

window.state = state;