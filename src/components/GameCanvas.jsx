
import React, { useRef, useEffect, useState } from 'react';
import { GameState } from '../game/GameState';
import '../styles/Game.css';

const GameCanvas = ({ setGameStateRef }) => {
    const canvasRef = useRef(null);
    const requestRef = useRef();
    const gameState = useRef(new GameState(window.innerWidth, window.innerHeight));
    const mousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Pass gameState up to parent for UI to access
        setGameStateRef(gameState.current);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gameState.current.width = window.innerWidth;
            gameState.current.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            gameState.current.update(mousePos.current);

            // Render Player
            gameState.current.player.draw(ctx);

            // Render Enemies
            gameState.current.enemies.forEach(e => e.draw(ctx));

            // Render Items
            gameState.current.items.forEach(i => i.draw(ctx));

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener('resize', handleResize);
        };
    }, [setGameStateRef]);

    const handleMouseMove = (e) => {
        mousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e) => {
        e.preventDefault(); // Prevent scrolling
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            mousePos.current = { x: touch.clientX, y: touch.clientY };
        }
    };

    return (
        <canvas
            ref={canvasRef}
            className="game-canvas"
            onMouseMove={handleMouseMove}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchMove}
        />
    );
};

export default GameCanvas;
