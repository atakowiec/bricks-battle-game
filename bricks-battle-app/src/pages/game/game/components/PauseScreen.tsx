import FloatingContainer from '../../../../components/FloatingContainer';
import useSelector from '../../../../hooks/useSelector.ts';
import { InlineButtons } from '../../../../components/InlineButtons.tsx';
import Button from '../../../../components/Button.tsx';
import useSocket from '../../../../socket/useSocket.ts';

export function PauseScreen() {
  const game = useSelector(state => state.game)!;
  const socket = useSocket();

  return (
    <FloatingContainer visible={true} setVisible={function() {
    }}>
      <h1>
        Game Paused
      </h1>
      {game.opponent && !game.opponent.online && <p>Waiting for opponent to rejoin...</p>}
      <InlineButtons>
        <Button onClick={() => socket.emit('leave_game')}>
          {game.player.owner ? 'Delete Game' : 'Leave Game'}
        </Button>
      </InlineButtons>
    </FloatingContainer>
  );
}