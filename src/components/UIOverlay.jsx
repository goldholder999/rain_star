import React, { useState, useEffect } from 'react';
import { SHOP_ITEMS, SPECIAL_SHOP_ITEMS } from '../game/Shop';
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

    const { player, coins, isGameOver, isGameClear, playDuration, rainbowRushTimer, oldKeys, specialGems, rainbowTickets, specialShopUnlocked, notification } = gameState;

    const currentDay = Math.floor(playDuration / 120) + 1; // 1 Day = 120s (2 mins)

    // Determine Player Icon for HUD based on Level
    let playerIconSrc = ICONS.LEVEL_1.src;
    if (player.level >= 100) playerIconSrc = ICONS.LEVEL_100.src;
    else if (player.level >= 10) playerIconSrc = ICONS.LEVEL_10.src;
    // Optionally use Character Icon if preferred, but checking Level Visuals:
    // if (true) playerIconSrc = ICONS.CHARACTER.src; 
    // sticking to Level Stars as per "Level 1~9: Star..." description


    const handleRestart = () => {
        gameState.reset();
        setShowShop(false);
    };

    const handleBuy = (item) => {
        if (gameState.coins >= item.cost) {
            gameState.coins -= item.cost;
            item.effect(gameState); // Pass gameState, including player
        }
    };

    const handleUnlockSpecialShop = () => {
        if (gameState.coins >= 100) {
            gameState.coins -= 100;
            gameState.specialShopUnlocked = true;
        }
    };

    const handleBuySpecial = (item) => {
        if (gameState.specialGems >= item.cost) {
            gameState.specialGems -= item.cost;
            item.effect(gameState);
        }
    };

    const handleUseTicket = () => {
        if (gameState.rainbowTickets > 0) {
            gameState.rainbowTickets--;
            gameState.rainbowRushTimer = 600;
        }
    };


    return (
        <div className="ui-overlay">
            {/* Rainbow Notification */}
            {rainbowRushTimer > 0 && (
                <div className="event-notification">
                    🌈 RAINBOW! 🌈
                </div>
            )}

            {/* Magnet Notification */}
            {gameState.magnetTimer > 0 && (
                <div className="magnet-notification">
                    🧲 자석 활성화! ({Math.ceil(gameState.magnetTimer / 60)}s)
                </div>
            )}

            {/* Double Growth Notification */}
            {gameState.doubleGrowthTimer > 0 && (
                <div className="growth-notification">
                    ⏫ 2배 성장! ({Math.ceil(gameState.doubleGrowthTimer / 60)}s)
                </div>
            )}

            {/* General Notification */}
            {notification && (
                <div className="general-notification" style={{
                    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', color: '#fff', padding: '10px 20px', borderRadius: '10px',
                    fontSize: '20px', zIndex: 1000, pointerEvents: 'none', whiteSpace: 'nowrap'
                }}>
                    {notification}
                </div>
            )}

            {/* HUD */}
            <div className="hud">
                <div className="hud-item">
                    <span> Day {currentDay}</span> {/* Show Day */}
                </div>
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
                <div className="hud-item special-resources">
                    <span title="낡은 열쇠">🗝️ {oldKeys}</span>
                    <span title="특별한 보석">💎 {specialGems}</span>
                    <span title="보유 티켓">🎫 {rainbowTickets}</span>
                    {rainbowTickets > 0 && (
                        <button className="use-ticket-btn" onClick={handleUseTicket} style={{ marginLeft: '10px', fontSize: '12px' }}>
                            티켓 사용
                        </button>
                    )}
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

                        {/* Special Shop Section */}
                        <div className="special-shop-divider" style={{ margin: '20px 0', borderTop: '1px solid #eee' }}></div>
                        <h2>
                            💎 특별 상점
                        </h2>
                        {!specialShopUnlocked ? (
                            <div className="special-shop-locked">
                                <p>특별 상점이 잠겨있습니다.</p>
                                <button
                                    disabled={coins < 100}
                                    onClick={handleUnlockSpecialShop}
                                    style={{ backgroundColor: '#666' }}
                                >
                                    잠금 해제 (100 💰)
                                </button>
                            </div>
                        ) : (
                            <div className="shop-items">
                                {SPECIAL_SHOP_ITEMS.map(item => (
                                    <div key={item.id} className="shop-item special-item" style={{ border: '2px solid gold' }}>
                                        <span>{item.name}</span>
                                        <button
                                            disabled={specialGems < item.cost}
                                            onClick={() => handleBuySpecial(item)}
                                        >
                                            구매 ({item.cost} 💎)
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        <button className="close-btn" onClick={() => setShowShop(false)}>닫기</button>
                    </div>
                </div>
            )}

            {/* Game Over Screen */}
            {isGameOver && (
                <div className="modal-overlay game-over">
                    <div className="modal">
                        <h1>게임 오버</h1>
                        <p>{currentDay}일차, 레벨 {player.level}에서 끝났습니다.</p>
                        <button className="restart-btn" onClick={handleRestart}>다시 시작</button>
                    </div>
                </div>
            )}

            {/* Game Clear Screen */}
            {isGameClear && (
                <div className="modal-overlay game-clear">
                    <div className="modal">
                        <h1>🎉 GAME CLEAR! 🎉</h1>
                        <p>축하합니다! 100일간의 장마를 무사히 견뎌냈습니다!</p>
                        <p>최종 레벨: {player.level}</p>
                        <button className="restart-btn" onClick={handleRestart}>다시 시작</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UIOverlay;
