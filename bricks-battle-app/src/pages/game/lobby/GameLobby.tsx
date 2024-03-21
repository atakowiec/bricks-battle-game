import style from './GameLobby.module.scss';
import title from '../../../utils/title.ts';
import useSelector from '../../../hooks/useSelector.ts';

export function GameLobby() {
  title('Game Lobby');
  const game = useSelector(state => state.game)!;

  return (
    <>
      <h1>Game Lobby</h1>
      <div className={style.gameId}>ID: {game.id}</div>
      <div className={style.membersBox}>
        <MemberCard owner={true} />
        <MemberCard owner={false} />
      </div>
    </>
  );
}

function MemberCard(props: { owner: boolean }) {
  const gameMember = useSelector(state => {
    const game = state.game!;
    if(props.owner)
      return game.player.owner ? game.player : game.opponent;

    return game.player.owner ? game.opponent : game.player;
  });

  return (
    <div className={style.memberCard}>
      {gameMember ?
        <>
          <img src={'/assets/icon.png'} alt="icon" />
          <div className={style.memberInfo}>
            <div className={style.memberName}>{gameMember.nickname}</div>
          </div>
        </>
        :
        <div className={style.noMember}>
          <div>Waiting for player...</div>
        </div>
      }
    </div>
  );
}