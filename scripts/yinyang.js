import eventBus from './eventbus.js';
import { increaseImbalance, increaseScore } from './state.js';
import { EVENTS } from './constants.js';

//TODO:  move to a helper file if useful?
const applyLimit = (value, [min, max]) => Math.max(min, Math.min(value, max));

const ROTATIONS = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right',
    NONE: 'none',
});

const COLOR = Object.freeze({
    WHITE: 'white',
    BLACK: 'black',
});

// const DEFAULT_DISTRIBUTION = 50;

export default class YinYang {
    constructor(centerX, centerY, radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.angle = 0;
        this.rotation = ROTATIONS.NONE;
        this.distributions = {
            [COLOR.WHITE]: 0,
            [COLOR.BLACK]: 0,
        };
        this.bindEvents();
        this.innerCircleRadius = this.radius / 8;
        this.maxDistribution = 2 * this.radius - this.innerCircleRadius;
        this.minDistribution = -this.innerCircleRadius;
    }

    bindEvents() {
        eventBus.subscribe(`${EVENTS.LEFT}_KEYDOWN`, () => {
            this.rotation = ROTATIONS.LEFT;
        });
        eventBus.subscribe(`${EVENTS.RIGHT}_KEYDOWN`, () => {
            this.rotation = ROTATIONS.RIGHT;
        });
        eventBus.subscribe(`${EVENTS.LEFT}_KEYUP`, () => {
            if (this.rotation === ROTATIONS.LEFT) {
                this.rotation = ROTATIONS.NONE;
            }
        });
        eventBus.subscribe(`${EVENTS.RIGHT}_KEYUP`, () => {
            if (this.rotation === ROTATIONS.RIGHT) {
                this.rotation = ROTATIONS.NONE;
            }
        });
        eventBus.subscribe(EVENTS.PICKUP, (pickup) => {
            const { x, y, color } = pickup;
            const side = this.getSide(x, y);
            if (side === color) {
                increaseScore(5);
                const oppositeColor = this.getOppositeColor(color);
                this.increaseDot(oppositeColor, -2);
            } else {
                // increase dot
                this.increaseDot(color, 2);
                increaseImbalance(side, 5);
            }
        });

        // Some unofficial key binds that let you resize the yin yang for testing purposes
        const changeWhiteDot = (e) => {
            const amount = e.deltaY;
            this.increaseDot(COLOR.WHITE, amount);
        };
        const changeBlackDot = (e) => {
            const amount = e.deltaY;
            this.increaseDot(COLOR.BLACK, amount);
        };
        const enableSizing = (color) => {
            document.addEventListener(
                'mousewheel',
                color === COLOR.WHITE ? changeWhiteDot : changeBlackDot,
            );
        };
        const disableSizing = (color) => {
            document.removeEventListener(
                'mousewheel',
                color === COLOR.WHITE ? changeWhiteDot : changeBlackDot,
            );
        };
        document.addEventListener('keydown', (e) => {
            if (e.key === 'c') enableSizing(COLOR.WHITE);
            if (e.key === 'z') enableSizing(COLOR.BLACK);
        });
        document.addEventListener('keyup', (e) => {
            if (e.key === 'c') disableSizing(COLOR.WHITE);
            if (e.key === 'z') disableSizing(COLOR.BLACK);
        });
    }

    rotate(direction, amount) {
        if (direction === ROTATIONS.LEFT) {
            this.angle -= amount;
        }
        if (direction === ROTATIONS.RIGHT) {
            this.angle += amount;
        }
        this.angle = this.angle % (Math.PI * 2);
    }

    draw(ctx) {
        this.rotate(this.rotation, 0.05);
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);

        this.drawCover(ctx);
        this.drawHalf(ctx, COLOR.BLACK);
        ctx.rotate(Math.PI);
        this.drawHalf(ctx, COLOR.WHITE);
        ctx.restore();
    }

    drawHalf(ctx, color) {
        const r = this.radius;
        // const rmod = 5;
        const oppositeColor = this.getOppositeColor(color);
        ctx.save();
        const halfPath = new Path2D();
        halfPath.moveTo(0, 0);
        halfPath.arc(0, 0, r, Math.PI * 1.5, Math.PI * 2.5);
        halfPath.arc(0, r / 2, r / 2, Math.PI * 2.5, Math.PI * 1.5, true);
        halfPath.arc(0, -r / 2, r / 2, Math.PI * 2.5, Math.PI * 1.5);
        halfPath.closePath();
        ctx.clip(halfPath);

        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(0, 0, r + 2, 0, Math.PI * 2);
        ctx.fill();

        this.drawInnerCircle(ctx, oppositeColor);
        ctx.restore();
    }

    drawInnerCircle(ctx, color) {
        const r = this.radius;
        const distribution = applyLimit(this.distributions[color], [
            this.minDistribution,
            this.maxDistribution,
        ]);
        const radius = this.innerCircleRadius + distribution;
        ctx.beginPath();
        ctx.arc(0, -r / 2, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    checkCriticalImbalance() {
        const whiteInnerRadius = this.innerCircleRadius + this.distributions[COLOR.WHITE];
        const blackInnerRadius = this.innerCircleRadius + this.distributions[COLOR.BLACK];

        if (whiteInnerRadius >= this.radius * 2) {
            console.log('Game over: white orb is too big');
        }
        if (whiteInnerRadius <= 0) {
            console.log('Game over: white orb is too small');
        }
        if (blackInnerRadius >= this.radius * 2) {
            console.log('Game over: black orb is too big');
        }
        if (blackInnerRadius <= 0) {
            console.log('Game over: black orb is too small');
        }

        return (
            whiteInnerRadius >= this.maxDistribution ||
            whiteInnerRadius <= this.minDistribution ||
            blackInnerRadius >= this.maxDistribution ||
            blackInnerRadius <= this.minDistribution
        );
    }

    increaseDot(color, value) {
        this.distributions[color] = applyLimit(this.distributions[color] + value, [
            this.minDistribution,
            this.maxDistribution,
        ]);

        this.checkCriticalImbalance();
    }

    drawCover(ctx) {
        const r = this.radius;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.clip();
    }

    checkCollision(pickup) {
        // Calculate distance between centers
        const dx = this.centerX - pickup.x;
        const dy = this.centerY - pickup.y;
        const distance = Math.hypot(dx, dy);

        // Check if distance is less than sum of radii
        return distance < this.radius + pickup.radius;
    }

    getSide(x, y) {
        // Translate point to center
        let dx = x - this.centerX;
        let dy = y - this.centerY;

        // Rotate point by negative angle
        const sin = Math.sin(-this.angle);
        const cos = Math.cos(-this.angle);
        const xRot = dx * cos - dy * sin;

        // left side is white, right side is black
        return xRot < 0 ? COLOR.WHITE : COLOR.BLACK;
    }

    getOppositeColor(color) {
        return color === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK;
    }
}
