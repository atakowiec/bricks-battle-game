import style from './MainMenu.module.scss';
import title from '../../utils/title.ts';
import useSocket from '../../socket/useSocket.ts';

export default function MainMenu() {
  title('Main Menu');
  const socket = useSocket();

  function onNewGame() {
    socket.emit("create_game");
  }

  return (
    <div className={style.container}>
      <h1>BRICKS BATTLE</h1>
      <button onClick={onNewGame}>Create game</button>
      <div className={style.separator}>
        or
      </div>
      <input type={'text'} placeholder={'Enter game code'} />
      <br />
      <button>Join game</button>
    </div>
  );
}