import React, { useState, useEffect } from 'react';
import { SHOP_ITEMS } from '../game/Shop';
import { ICONS } from '../game/Assets';
import '../styles/Game.css';

const UIOverlay = ({ gameState }) => {
    // ... state ...
    const [, setTick] = useState(0);
    const [showShop, setShowShop] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTick(t => t + 1);
        }, 100);
        return () => clearInterval(interval);
    }, []);

    if (!gameState) return null;

    const { player, coins, isGameOver } = gameState;

    const handleRestart = () => {
        gameState.reset();
    };

    const handleBuy = (item) => {
        if (gameState.coins >= item.cost) {
            gameState.coins -= item.cost;
            item.effect(gameState.player);
        }
    };

    // Determine player icon source based on level (similar to Logic but for UI)
    let playerIconSrc = ICONS.CHARACTER.src;


    return (
        <div className="ui-overlay">
            {/* HUD */}
            <div className="hud">
                <div className="hud-item">
                    <span>레벨: {player.level}</span>
                    <img src={playerIconSrc} alt="Level Icon" className="icon-small" />
                    <div className="level-bar-container">
                        <div className="level-bar" style={{ width: `${(player.level % 10) * 10}%` }}></div>
                    </div>
                </div>
                <div className="hud-item coin">
                    <img src={ICONS.COIN_SRC} alt="Coin" className="icon-small" />
                    <span> {coins}</span>
                </div>
                <div className="hud-item">
                    <button onClick={() => setShowShop(!showShop)}>
                        <img src={ICONS.SHOP_SRC} alt="Shop" className="icon-small" /> 상점
                    </button>
                </div>
            </div>

            {/* Shop Modal */}
            {showShop && (
                <div className="modal-overlay">
                    <div className="modal shop-modal">
                        <h2>
                            <img src={ICONS.SHOP_SRC} alt="Shop" className="icon-medium" /> 아이템 상점
                        </h2>
                        <div className="shop-items">
                            {SHOP_ITEMS.map(item => (
                                <div key={item.id} className="shop-item">
                                    <span>{item.name}</span>
                                    <button
                                        disabled={coins < item.cost}
                                        onClick={() => handleBuy(item)}
                                    >
                                        구매 ({item.cost} 💰)
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button className="close-btn" onClick={() => setShowShop(false)}>닫기</button>
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
                <div className="modal-overlay game-over">
                    <div className="modal">
                        <h1>게임 오버</h1>
                        <p>당신은 레벨 {player.level}까지 생존했습니다!</p>
                        <button className="restart-btn" onClick={handleRestart}>다시 시작</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UIOverlay;
