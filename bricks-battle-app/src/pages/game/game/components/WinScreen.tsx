import FloatingContainer from '../../../../components/FloatingContainer';
import useSelector from '../../../../hooks/useSelector.ts';
import { InlineButtons } from '../../../../components/InlineButtons.tsx';
import Button from '../../../../components/Button.tsx';
import useSocket from '../../../../socket/useSocket.ts';

export function WinScreen() {
  const game = useSelector(state => state.game)!;
  const socket = useSocket();

  function playAgain() {
    if (!game.player.owner) return;

    socket.emit('play_again');
  }

  function leaveGame() {
    socket.emit('leave_game');
  }

  return (
    <FloatingContainer visible={true} setVisible={function() {
    }}>
      <h1>
        Game Over
      </h1>
      <h2>
        {game.winner === game.player.nickname ? 'You won!' : 'You lost!'}
      </h2>
      <InlineButtons>
        <Button disabled={!game.player.owner} onClick={playAgain}>
          Play Again
        </Button>
        <Button onClick={leaveGame}>
          {game.player.owner ? 'Delete Game' : 'Leave Game'}
        </Button>
      </InlineButtons>
    </FloatingContainer>
  );
}