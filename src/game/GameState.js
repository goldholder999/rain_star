
import { Droplet, Item } from './Entities';

export class GameState {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.player = new Droplet(width / 2, height / 2, 1, true); // Level 1
        this.enemies = [];
        this.items = [];
        this.coins = 0;
        this.isGameOver = false;
        this.frameCount = 0;
        this.spawnerTimer = 0;
    }

    reset() {
        this.player = new Droplet(this.width / 2, this.height / 2, 1, true);
        this.enemies = [];
        this.items = [];
        this.coins = 0;
        this.isGameOver = false;
        this.frameCount = 0;
    }

    update(input) {
        if (this.isGameOver) return;

        this.frameCount++;

        // Player Update
        this.player.update(this.width, this.height, input.x, input.y);

        if (this.player.level < 0) {
            this.isGameOver = true;
        }

        // Spawning Logic
        this.spawnerTimer++;
        if (this.spawnerTimer > 60) { // Every ~1 second
            this.spawnEntities();
            this.spawnerTimer = 0;
        }

        // Update Enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.width, this.height);
            // Collision with Player
            if (this.checkCollision(this.player, enemy)) {
                if (this.player.level > enemy.level) {
                    // Gain 50% of enemy level, minimum 1
                    const gain = Math.max(1, Math.floor(enemy.level * 0.5));
                    this.player.grow(gain);
                    this.coins += 10;
                    enemy.markedForDeletion = true;
                } else {
                    this.player.shrink(10);
                    // Bounce back
                    const angle = Math.atan2(this.player.y - enemy.y, this.player.x - enemy.x);
                    this.player.x += Math.cos(angle) * 20;
                    this.player.y += Math.sin(angle) * 20;

                    // Enemy also bounces slightly
                    enemy.velocity.x *= -1;
                    enemy.velocity.y *= -1;
                }
            }
        });

        // Update Items
        this.items.forEach(item => {
            // Simple drift for rain?
            if (item.type === 'RAIN') {
                item.y += 1;
                if (item.y > this.height) item.markedForDeletion = true;
            }

            if (this.checkCollision(this.player, item)) {
                this.handleItemCollection(item);
                item.markedForDeletion = true;
            }
        });

        // Filter dead entities
        this.enemies = this.enemies.filter(e => !e.markedForDeletion);
        this.items = this.items.filter(i => !i.markedForDeletion);

        // Check level up required spawn (Rainbow)
        // Simplified: Random chance for now, logic for "Every 10 levels" can be checked here
        if (this.player.level % 10 === 0 && this.player.level > 1 && !this.items.some(i => i.type === 'RAINBOW')) {
            // Spawn rainbow if not exists - limitation: this spawns excessively if player stays at level 10. 
            // Better logic: Tracking "last rainbow level".
        }
    }

    spawnEntities() {
        // Rain
        if (Math.random() < 0.1) {
            this.items.push(new Item(Math.random() * this.width, 0, 'RAIN'));
        }

        // Enemies
        if (this.enemies.length < 5 && Math.random() < 0.05) {
            let level;
            // Early game helper: 60% chance to spawn edible enemies if player level < 20
            if (this.player.level < 20 && Math.random() < 0.6) {
                level = Math.floor(Math.random() * this.player.level) + 1;
            } else {
                level = Math.floor(Math.random() * (this.player.level + 5)) + 1;
            }
            this.enemies.push(new Droplet(Math.random() * this.width, Math.random() * this.height, level));
        }

        // Bomb
        if (Math.random() < 0.02) {
            this.items.push(new Item(Math.random() * this.width, Math.random() * this.height, 'BOMB'));
        }

        // Coin
        if (Math.random() < 0.03) {
            this.items.push(new Item(Math.random() * this.width, Math.random() * this.height, 'COIN'));
        }

        // Rainbow - rare spawn
        if (Math.random() < 0.01) {
            this.items.push(new Item(Math.random() * this.width, Math.random() * this.height, 'RAINBOW'));
        }
    }

    handleItemCollection(item) {
        switch (item.type) {
            case 'RAIN':
                this.player.grow(1);
                break;
            case 'COIN':
                this.coins += 10;
                break;
            case 'BOMB':
                this.player.shrink(5);
                break;
            case 'RAINBOW':
                this.player.grow(5);
                break;
        }
    }

    checkCollision(c1, c2) {
        const dx = c1.x - c2.x;
        const dy = c1.y - c2.y;
        const distance = Math.hypot(dx, dy);
        return distance < c1.radius + c2.radius;
    }
}
