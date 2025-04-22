const DEFAULT_RADIUS = 8;
const DEFAULT_SPEED = 2;

/**
 * Items that the player can interact with.
 * Unless overridden, all pickups are trying to get to the center
 */
export default class Pickups {
    constructor(x, y, speed = DEFAULT_SPEED) {
        this.x = x;
        this.y = y;
        this.radius = DEFAULT_RADIUS;
        this.speed = speed;
    }

    update(ctx) {
        const centerX = ctx.canvas.width / 2;
        const centerY = ctx.canvas.height / 2;
        const dx = centerX - this.x;
        const dy = centerY - this.y;
        const dist = Math.hypot(dx, dy);
        this.x += (dx / dist) * this.speed;
        this.y += (dy / dist) * this.speed;
        return dist;
    }

    draw(ctx) {
        this.update(ctx);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    }
}
