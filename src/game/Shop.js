
export const SHOP_ITEMS = [
    { id: 'speed', name: '속도 증가', cost: 50, effect: (gameState) => { gameState.player.speed += 0.5; } },
    { id: 'magnet', name: '자석 (30초)', cost: 120, effect: (gameState) => { gameState.magnetTimer = 1800; } },
    { id: 'double_growth', name: '2배 성장 (30초)', cost: 250, effect: (gameState) => { gameState.doubleGrowthTimer = 1800; } },
    { id: 'grow', name: '즉시 성장', cost: 150, effect: (gameState) => { gameState.player.grow(5); } }
];

export const SPECIAL_SHOP_ITEMS = [
    {
        id: 'rainbow_ticket',
        name: 'RAINBOW 1회권',
        cost: 5, // 5 Special Gems
        currency: 'special_gem',
        effect: (gameState) => {
            gameState.rainbowTickets++;
            // Or immediate effect? "Ticket to buy" implies holding it? 
            // Or "Use ticket"?
            // Let's just give a ticket. The user can "use" it? 
            // Requirement 9: "Buy Rainbow Ticket".
            // Requirement 10 (implicit): How to use? 
            // Maybe a button in UI to USE ticket?
            // Or buying it triggers it? "1회권 티켓을 살수 있다" -> Buy Ticket.
            // I'll add a 'Use Ticket' button in UI later.
        }
    }
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
