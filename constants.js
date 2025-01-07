export const CANVAS = {
    WIDTH: 800,
    HEIGHT: 300
};

export const PLAYER = {
    WIDTH: 30,
    HEIGHT: 30,
    START_X: 100,
    GRAVITY: 0.7,
    JUMP_FORCE: -13
};

export const GAME = {
    BASE_SPEED: 5,
    MAX_SPEED: 9,
    SPEED_INCREMENT: 0.15,
    DIFFICULTY_INCREMENT: 0.04,
    MIN_OBSTACLES: 4,
    MIN_OBSTACLE_SPACING: 400
};

export const FLASH = {
    INITIAL_INTENSITY: 0.6,
    DECAY: 0.03
};

export const COLORS = {
    PLAYER_GRADIENT: {
        START: '#6366f1',
        END: '#4f46e5'
    },
    OBSTACLE_GRADIENT: {
        START: '#f87171',
        END: '#ef4444'
    },
    TEXT: '#1e293b'
};

export const OBSTACLE_PATTERNS = [
    { width: 30, height: 40, gap: 400 },
    { width: 30, height: 50, gap: 250, double: true },
    { width: 30, heightLow: 30, heightHigh: 60, gap: 300 },
    { width: 20, height: 30, gap: 200, triple: true }
];
