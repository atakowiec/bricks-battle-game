import { PropsWithGame } from './GameBox.tsx';
import { GameCanvas } from './GameCanvas.tsx';
import { useEffect, useRef } from 'react';
import useSocket from '../../../socket/useSocket.ts';

interface PressedKeysRef {
  left?: boolean;
  right?: boolean;
}

export function PlayerBoard(props: PropsWithGame) {
  const game = props.game!;
  const pressedKeys = useRef<PressedKeysRef>({});
  const socket = useSocket();

  useEffect(() => {
    const keydown = (e: KeyboardEvent) => {
      if (game.status !== 'playing') return;
      if (e.key === 'ArrowLeft') {
        pressedKeys.current['left'] = true;
      } else if (e.key === 'ArrowRight') {
        pressedKeys.current['right'] = true;
      }
    };

    const keyup = (e: KeyboardEvent) => {
      if (game.status !== 'playing') return;
      if (e.key === 'ArrowLeft') {
        pressedKeys.current['left'] = false;
      } else if (e.key === 'ArrowRight') {
        pressedKeys.current['right'] = false;
      }
    };

    const updatePaddle = () => {
      if (pressedKeys.current['left']) {
        socket.emit('move_paddle', 'left');
      }
      if (pressedKeys.current['right']) {
        socket.emit('move_paddle', 'right');
      }
    };

    const moveInterval = setInterval(updatePaddle, 20);

    window.addEventListener('keydown', keydown);
    window.addEventListener('keyup', keyup);
    return () => {
      clearInterval(moveInterval);

      window.removeEventListener('keydown', keydown);
      window.removeEventListener('keyup', keyup);
    };
  }, [game]);

  return (
    <GameCanvas gameMember={game.player} map={game.player.board} game={game} />
  );
}