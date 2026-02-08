
export const SHOP_ITEMS = [
    { id: 'speed', name: '속도 증가', cost: 50, effect: (gameState) => { gameState.player.speed += 0.5; } },
    { id: 'magnet', name: '자석 (30초)', cost: 120, effect: (gameState) => { gameState.magnetTimer = 1800; } },
    { id: 'double_growth', name: '2배 성장 (30초)', cost: 250, effect: (gameState) => { gameState.doubleGrowthTimer = 1800; } },
    { id: 'grow', name: '즉시 성장', cost: 150, effect: (gameState) => { gameState.player.grow(5); } }
];

export class Shop {
    constructor() {
        this.isOpen = false;
    }

    buy(itemId, gameState) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;

        if (gameState.coins >= item.cost) {
            gameState.coins -= item.cost;
            item.effect(gameState);
            return true;
        }
        return false;
    }
}
