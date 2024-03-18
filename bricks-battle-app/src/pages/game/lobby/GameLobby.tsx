import style from './GameLobby.module.scss';
import title from '../../../utils/title.ts';

export function GameLobby() {
  title('Game Lobby');

  return (
    <>
      <h1>Game Lobby</h1>
      <div className={style.gameId}>ID: 213af4</div>
      <div className={style.membersBox}>
        <MemberCard />
        <MemberCard />
      </div>
    </>
  );
}

function MemberCard() {
  return (
    <></>
  );
}