import FloatingContainer from '../../../../components/FloatingContainer';

export function PauseScreen() {
  return (
    <FloatingContainer visible={true} setVisible={function() {
    }}>
      <h1>
        Pause Menu
      </h1>
      <p>
        Game is already paused
      </p>
    </FloatingContainer>
  );
}