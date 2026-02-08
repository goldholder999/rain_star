
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
        this.isGameClear = false; // New Game Clear State
        this.frameCount = 0;
        this.spawnerTimer = 0;

        // Rainbow Rush Event
        this.rainbowRushTimer = 0;

        // Magnet Item
        this.magnetTimer = 0;

        // Double Growth Item
        this.doubleGrowthTimer = 0;

        // Time Tracking for Game Clear
        this.playDuration = 0; // in seconds (approx)
    }

    reset() {
        this.player = new Droplet(this.width / 2, this.height / 2, 1, true);
        this.enemies = [];
        this.items = [];
        this.coins = 0;
        this.isGameOver = false;
        this.isGameClear = false;
        this.frameCount = 0;
        this.rainbowRushTimer = 0;
        this.magnetTimer = 0;
        this.doubleGrowthTimer = 0;
        this.playDuration = 0;
    }

    update(input) {
        if (this.isGameOver || this.isGameClear) return;

        this.frameCount++;

        // Track time (approx 60 frames = 1 second)
        if (this.frameCount % 60 === 0) {
            this.playDuration++;

            // Trigger Rainbow Rush every 3 minutes (180 seconds) with 70% chance
            if (this.playDuration > 0 && this.playDuration % 180 === 0) {
                if (Math.random() < 0.7) {
                    this.rainbowRushTimer = 600; // 10 seconds
                }
            }
        }

        // Check Game Clear (100 Days, 1 Day = 3 mins = 180 seconds)
        // Total time = 100 * 180 = 18000 seconds
        const currentDay = Math.floor(this.playDuration / 180) + 1;
        if (currentDay > 100) {
            this.isGameClear = true;
            return;
        }

        // Handle Rainbow Rush Event Timer
        if (this.rainbowRushTimer > 0) {
            this.rainbowRushTimer--;
        }

        // Handle Magnet Timer
        if (this.magnetTimer > 0) {
            this.magnetTimer--;
        }

        // Handle Double Growth Timer
        if (this.doubleGrowthTimer > 0) {
            this.doubleGrowthTimer--;
        }

        // Player Update
        this.player.update(this.width, this.height, input.x, input.y);

        if (this.player.level < 0) {
            this.isGameOver = true;
        }

        // Spawning Logic
        this.spawnerTimer++;
        // Spawn faster during Rainbow Rush
        const spawnInterval = this.rainbowRushTimer > 0 ? 10 : 60;

        if (this.spawnerTimer > spawnInterval) {
            this.spawnEntities();
            this.spawnerTimer = 0;
        }

        // Update Enemies
        this.enemies.forEach(enemy => {
            enemy.update(this.width, this.height);
            // Collision with Player
            if (this.checkCollision(this.player, enemy)) {
                let playerWins = false;

                if (this.player.level > enemy.level) {
                    playerWins = true;
                } else if (this.player.level === enemy.level) {
                    // 50% chance to win if same level
                    if (Math.random() < 0.5) playerWins = true;
                }

                if (playerWins) {
                    // Gain 50% of enemy level, minimum 1
                    let gain = Math.max(1, Math.floor(enemy.level * 0.5));

                    // Double Growth Effect
                    if (this.doubleGrowthTimer > 0) gain *= 2;

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
            // Magnet Effect: Attract items (coins/rain/rainbow/bomb?) 
            // Usually magnets attract good stuff. Let's attract COIN, RAIN, RAINBOW. Not BOMB.
            if (this.magnetTimer > 0 && item.type !== 'BOMB') {
                const dx = this.player.x - item.x;
                const dy = this.player.y - item.y;
                const dist = Math.hypot(dx, dy);
                if (dist < 300) { // Range 300
                    item.x += (dx / dist) * 5; // Speed 5 towards player
                    item.y += (dy / dist) * 5;
                }
            }

            // Simple drift for rain, rainbow, and bomb
            if (item.type === 'RAIN' || item.type === 'RAINBOW' || item.type === 'BOMB') {
                let speed = 1;
                if (item.type === 'RAINBOW') speed = 1.5;
                if (item.type === 'BOMB') speed = 2; // Bombs fall faster? Let's say 2.

                item.y += speed;

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
    }

    spawnEntities() {
        // Rainbow Rush Effect: Spawn LOTS of Rainbows
        if (this.rainbowRushTimer > 0) {
            if (Math.random() < 0.3) {
                this.items.push(new Item(Math.random() * this.width, 0, 'RAINBOW'));
            }
            // Spawn normal stuff less frequently during rush to focus on rainbows? 
            // Or just add rainbows on top. Let's add on top but slightly reduced enemies.
        }

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
            this.items.push(new Item(Math.random() * this.width, 0, 'BOMB')); // Spawn at top
        }

        // Coin
        if (Math.random() < 0.03) {
            this.items.push(new Item(Math.random() * this.width, Math.random() * this.height, 'COIN'));
        }

        // Rainbow - Normal rare spawn (outside of rush)
        if (this.rainbowRushTimer <= 0 && Math.random() < 0.01) {
            this.items.push(new Item(Math.random() * this.width, Math.random() * this.height, 'RAINBOW'));
        }
    }

    handleItemCollection(item) {
        let multiplier = this.doubleGrowthTimer > 0 ? 2 : 1;

        switch (item.type) {
            case 'RAIN':
                this.player.grow(1 * multiplier);
                break;
            case 'COIN':
                this.coins += 10;
                break;
            case 'BOMB':
                this.player.shrink(5); // Bad things shouldn't overlap with good buff? Or maybe they do? "Eating drops 2x increase" usually implies positive. I'll keep penalties as is.
                break;
            case 'RAINBOW':
                this.player.grow(5 * multiplier);
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
