
export const SHOP_ITEMS = [
    { id: 'speed', name: '속도 증가', cost: 50, effect: (player) => { player.speed += 0.5; } },
    { id: 'shield', name: '보호막 (준비 중)', cost: 100, effect: (player) => { console.log("Shield bought"); } }, // Placeholder
    { id: 'grow', name: '즉시 성장', cost: 150, effect: (player) => { player.grow(5); } }
];

export class Shop {
    constructor() {
        this.isOpen = false;
    }

    buy(itemId, player, wallet) {
        const item = SHOP_ITEMS.find(i => i.id === itemId);
        if (!item) return false;

        if (wallet.coins >= item.cost) {
            wallet.coins -= item.cost;
            item.effect(player);
            return true;
        }
        return false;
    }
}
