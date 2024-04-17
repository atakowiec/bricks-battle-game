import FloatingContainer from '../../../../components/FloatingContainer';
import useSelector from '../../../../hooks/useSelector.ts';
import { InlineButtons } from '../../../../components/InlineButtons.tsx';
import Button from '../../../../components/Button.tsx';
import useSocket from '../../../../socket/useSocket.ts';

export function PauseScreen() {
  const game = useSelector(state => state.game)!;
  const socket = useSocket();
  const isPausedByOwner = game.status === 'owner_paused';

  return (
    <FloatingContainer visible={true} setVisible={function() {
    }}>
      <h1>
        Game Paused
      </h1>
      {!isPausedByOwner && game.opponent && !game.opponent.online && <p>Waiting for opponent to rejoin...</p>}
      {isPausedByOwner && <p>Game paused by owner</p>}
      <InlineButtons>
        {isPausedByOwner && game.player.owner && <Button onClick={() => socket.emit('resume_game')}>
          Resume Game
        </Button>}
        <Button onClick={() => socket.emit('leave_game')}>
          {game.player.owner ? 'Delete Game' : 'Leave Game'}
        </Button>
      </InlineButtons>
    </FloatingContainer>
  );
}