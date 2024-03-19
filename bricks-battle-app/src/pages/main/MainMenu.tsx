import style from './MainMenu.module.scss';
import title from '../../utils/title.ts';
import useSocket from '../../socket/useSocket.ts';
import { useState } from 'react';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import useSelector from '../../hooks/useSelector.ts';

export default function MainMenu() {
  title('Main Menu');
  const socket = useSocket();
  const [enterNameVisible, setEnterNameVisible] = useState(false);
  const nickname = useSelector(state => state.user.nickname);

  function onNewGame() {
    if (!nickname)
      return setEnterNameVisible(true);

    socket.emit('create_game');
  }

  function onJoinGame() {
    if (!nickname)
      return setEnterNameVisible(true);
  }

  return (
    <>
      <FloatingContainer visible={enterNameVisible} setVisible={setEnterNameVisible}>
        <h1>
          Enter your nickname
        </h1>
        <div className={'col-8 mx-auto'}>
          <input type={'text'} placeholder={'nickname'} className={'text-center'} />
          <button>
            Save
          </button>
        </div>
      </FloatingContainer>
      <div className={style.container}>
        <h1>BRICKS BATTLE</h1>
        {nickname && <div className={style.nicknameBox}>
          Hi, {nickname}!
        </div>}
        <button onClick={onNewGame}>Create game</button>
        <div className={style.separator}>
          or
        </div>
        <input type={'text'} placeholder={'Enter game code'} />
        <br />
        <button onClick={onJoinGame}>Join game</button>
      </div>
    </>
  );
}