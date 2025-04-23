const DEFAULT_RADIUS = 8;
const DEFAULT_SPEED = 5;
import eventBus from './eventbus.js';

/**
 * Items that the player can interact with.
 * Unless overridden, all pickups are trying to get to the center
 */
export default class Pickups {
    constructor(x, y, id, speed = DEFAULT_SPEED) {
        this.x = x;
        this.y = y;
        this.id = id;
        this.radius = DEFAULT_RADIUS;
        this.speed = speed;
        this.collided = false;
        this.color = Math.floor(Math.random() * 10) % 2 === 0 ? 'white' : 'black';
    }

    update(ctx) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
    }

    handleCollision() {
        if (this.collided) return;
        eventBus.publish('PICKUP', this.id, this.x, this.y, this.color);
        this.collided = true;
    }

    draw(ctx) {
        this.update(ctx);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}
