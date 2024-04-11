import useSelector from '../../../hooks/useSelector.ts';
import style from './Game.module.scss';
import { GameHeader } from './GameHeader.tsx';
import { GameState } from '../../../store/gameSlice.ts';
import { PlayerBoard } from './PlayerBoard.tsx';
import { OpponentBoard } from './OpponentBoard.tsx';
import { BoardContainer } from './BoardContainer.tsx';

export interface PropsWithGame {
  game: GameState;
}

export function GameBox() {
  const game = useSelector(state => state.game!)!;

  return (
    <div className={style.gameContainer}>
      <GameHeader game={game} />
      <div className={style.boardsContainer}>
        <BoardContainer className={style.playerBoard}>
          <PlayerBoard game={game} />
        </BoardContainer>
        <BoardContainer className={style.opponentBoard}>
          <OpponentBoard game={game} />
        </BoardContainer>
      </div>
    </div>
  );
}