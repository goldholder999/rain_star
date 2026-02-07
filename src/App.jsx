
import React, { useState } from 'react';
import GameCanvas from './components/GameCanvas';
import UIOverlay from './components/UIOverlay';
import './App.css';

function App() {
  // We need to share the game state between the Canvas (where logic runs) and UI (where stats are shown)
  const [gameStateRef, setGameStateRef] = useState(null);

  return (
    <div className="app-container">
      <GameCanvas setGameStateRef={setGameStateRef} />
      {gameStateRef && <UIOverlay gameState={gameStateRef} />}
    </div>
  );
}

export default App;
