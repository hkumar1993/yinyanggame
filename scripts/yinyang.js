const ROTATIONS = Object.freeze({
    LEFT: 'left',
    RIGHT: 'right',
    NONE: 'none',
})

export default class YinYang {
    constructor(centerX, centerY, radius) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.angle = 0;
        this.rotation = ROTATIONS.NONE

        this.bindEvents();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                this.rotation = ROTATIONS.LEFT;
            }
            if (e.key === 'ArrowRight') {
                this.rotation = ROTATIONS.RIGHT;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (
                e.key === 'ArrowLeft' &&
                this.rotation === ROTATIONS.LEFT) {
                this.rotation = ROTATIONS.NONE;
            }
            if (
                e.key === 'ArrowRight' &&
                this.rotation === ROTATIONS.RIGHT) {
                this.rotation = ROTATIONS.NONE;
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
    }

    draw(ctx) {
        this.rotate(this.rotation, 0.05);
        const r = Math.abs(this.radius);
        ctx.save();
        ctx.translate(this.centerX, this.centerY);
        ctx.rotate(this.angle);

        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI * 0.5, Math.PI * 1.5);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, 0, r, Math.PI * 1.5, Math.PI * 2.5);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, -r / 2, r / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, r / 2, r / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(0, -r / 2, r / 8, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, r / 2, r / 8, 0, Math.PI * 2);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.restore();
    }
}