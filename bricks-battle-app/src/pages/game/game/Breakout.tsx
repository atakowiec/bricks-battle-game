import { useRef, useEffect } from 'react';

const BreakoutGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  let ctx: CanvasRenderingContext2D | null = null;

  // Stan gry
  const initialState = {
    paddleX: 200,
    ballX: 200,
    ballY: 200,
    ballSpeedX: 3,
    ballSpeedY: -3
  };

  let state = { ...initialState };

  // Funkcja aktualizująca stan gry
  const updateGame = () => {
    state.ballX += state.ballSpeedX;
    state.ballY += state.ballSpeedY;

    // Dodaj logikę kolizji, ruchu paletki itp.
  };

  // Funkcja renderująca grę
  const draw = () => {
    if(!ctx) return

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Narysuj paletkę
    ctx.fillStyle = "#0095DD";
    ctx.fillRect(state.paddleX, 380, 100, 10);

    // Narysuj piłkę
    ctx.beginPath();
    ctx.arc(state.ballX, state.ballY, 10, 0, Math.PI*2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    ctx = canvas.getContext('2d');

    const gameLoop = setInterval(() => {
      updateGame();
      draw();
    }, 10);

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <canvas ref={canvasRef} width={800} height={400} />
  );
};

export default BreakoutGame;
