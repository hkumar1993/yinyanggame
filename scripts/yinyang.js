import eventBus from './eventbus.js';
import {
    increaseImbalance,
    increaseScore,
} from './state.js';

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
    }

    bindEvents() {
        eventBus.subscribe('LEFT_KEYDOWN', () => {
            this.rotation = ROTATIONS.LEFT;
        });
        eventBus.subscribe('RIGHT_KEYDOWN', () => {
            this.rotation = ROTATIONS.RIGHT;
        });
        eventBus.subscribe('LEFT_KEYUP', () => {
            if (this.rotation === ROTATIONS.LEFT) {
                this.rotation = ROTATIONS.NONE;
            }
        });
        eventBus.subscribe('RIGHT_KEYUP', () => {
            if (this.rotation === ROTATIONS.RIGHT) {
                this.rotation = ROTATIONS.NONE;
            }
        });
        eventBus.subscribe('PICKUP', (id, x, y, color) => {
            const side = this.getSide(x, y);
            if (side === color) {
                increaseScore(5);
            } else {
                // increase dot
                this.increaseDot(color, 2);
                increaseImbalance(side, 5)
            }
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
        const oppositeColor = color === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK;
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
        const innerCircleRadius = Math.min(2 * r, r / 8 + this.distributions[color]);
        ctx.beginPath();
        ctx.arc(0, -r / 2, innerCircleRadius, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
    }

    increaseDot(color, value) {
        this.distributions[color] = this.distributions[color] + value;
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
}
