import FloatingContainer from '../../../../components/FloatingContainer';
import useSelector from '../../../../hooks/useSelector.ts';

export function PauseScreen() {
  const game = useSelector(state => state.game)!;

  return (
    <FloatingContainer visible={true} setVisible={function() {
    }}>
      <h1>
        Game Paused
      </h1>
      {game.opponent && !game.opponent.online && <p>Waiting for opponent to rejoin...</p>}
    </FloatingContainer>
  );
}