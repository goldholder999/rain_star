
import { ICONS } from './Assets';

export class Entity {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.markedForDeletion = false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(canvasWidth, canvasHeight) {
        // Base update logic
    }
}

export class Droplet extends Entity {
    constructor(x, y, level, isPlayer = false) {
        // Level 1 radius = 10, increases by 1 per level, capped at level 100
        const radius = 10 + Math.min(level, 100);
        const color = isPlayer ? '#4facfe' : '#ff7e5f'; // Player: Blue, Enemy: Reddish
        super(x, y, radius, color);
        this.level = level;
        this.isPlayer = isPlayer;
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.speed = 4.5;
        this.target = null;
        this.icon = ICONS.LEVEL_1; // Default
        this.updateIcon();
    }

    updateIcon() {
        if (this.isPlayer) {
            this.icon = ICONS.CHARACTER;
        } else {
            if (this.level >= 100) this.icon = ICONS.LEVEL_100;
            else if (this.level >= 10) this.icon = ICONS.LEVEL_10;
            else this.icon = ICONS.LEVEL_1;
        }
    }

    draw(ctx) {
        // Draw Icon (Image) if available
        if (this.icon && this.icon.complete) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip(); // Force circular clipping

            // Draw image centered and scaled
            const size = this.radius * 2; // Diameter
            ctx.drawImage(this.icon, this.x - this.radius, this.y - this.radius, size, size);
            ctx.restore();
        } else {
            // Fallback to circle
            super.draw(ctx);

            // Fallback text if image load fails
            // Fallback text if image load fails
            ctx.fillStyle = 'white';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.font = '20px Jua';
            ctx.strokeText('?', this.x, this.y - this.radius - 10);
            ctx.fillText('?', this.x, this.y - this.radius - 10);
        }

        // Draw Level Number
        // Draw Level Number
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.font = '12px Jua';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.strokeText(`Lv.${this.level}`, this.x, this.y);
        ctx.fillText(`Lv.${this.level}`, this.x, this.y);
    }

    update(canvasWidth, canvasHeight, targetX, targetY) {
        this.updateIcon();

        if (this.isPlayer) {
            // Player follows mouse/target with easing
            const dx = targetX - this.x;
            const dy = targetY - this.y;
            const distance = Math.hypot(dx, dy);

            if (distance > 5) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        } else {
            // Simple bounce logic for enemies
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            if (this.x - this.radius < 0 || this.x + this.radius > canvasWidth) this.velocity.x *= -1;
            if (this.y - this.radius < 0 || this.y + this.radius > canvasHeight) this.velocity.y *= -1;
        }

        // Boundary check
        this.x = Math.max(this.radius, Math.min(canvasWidth - this.radius, this.x));
        this.y = Math.max(this.radius, Math.min(canvasHeight - this.radius, this.y));
    }

    grow(amount) {
        this.level += amount;
        this.radius = 10 + Math.min(this.level, 100);
    }

    shrink(amount) {
        this.level -= amount;
        this.radius = 10 + Math.min(this.level, 100);
    }
}

export class Item extends Entity {
    constructor(x, y, type) {
        let color = 'white';
        let radius = 5;

        switch (type) {
            case 'RAIN': color = '#70e1f5'; radius = 5; break; // Softer Cyan
            case 'BOMB': color = 'black'; radius = 8; break;
            case 'RAINBOW': color = 'linear-gradient'; radius = 10; break;
            case 'COIN': color = 'gold'; radius = 8; break;
        }

        super(x, y, radius, color);
        this.type = type;
    }

    draw(ctx) {
        if (this.type === 'RAINBOW') {
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
            gradient.addColorStop(0, 'red');
            gradient.addColorStop(0.2, 'orange');
            gradient.addColorStop(0.4, 'yellow');
            gradient.addColorStop(0.6, 'green');
            gradient.addColorStop(0.8, 'blue');
            gradient.addColorStop(1, 'purple');
            ctx.fillStyle = gradient;
        } else {
            ctx.fillStyle = this.color;
        }

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        if (this.type === 'COIN') {
            // Draw Coin Image if available? Or stick to simple text for items?
            // Let's stick to text or simple shape for items to distinguish from players
            // Or maybe draw a small coin image?
            // Or maybe draw a small coin image?
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 2;
            ctx.font = '10px Jua';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeText('$', this.x, this.y);
            ctx.fillText('$', this.x, this.y);
        }

        if (this.type === 'BOMB') {
            ctx.fillStyle = 'black';
            ctx.strokeStyle = 'white'; // Maybe no stroke for emoji? Or keeping it for visibility.
            ctx.font = '24px Arial'; // Larger font for emoji
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('💣', this.x, this.y + 2); // Adjustment for emoji baseline
        }
    }
}
