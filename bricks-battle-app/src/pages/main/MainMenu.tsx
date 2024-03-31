import style from './MainMenu.module.scss';
import title from '../../utils/title.ts';
import { useEffect, useRef, useState } from 'react';
import useSelector from '../../hooks/useSelector.ts';
import useSocket from '../../socket/useSocket.ts';
import { EnterNickname } from './EnterNickname.tsx';

export default function MainMenu() {
  title('Main Menu');
  const socket = useSocket();
  const nickname = useSelector(state => state.user.nickname);

  const [enterNameVisible, setEnterNameVisible] = useState(false);
  const [gameIdError, setGameIdError] = useState('');

  const clickedActionRef = useRef<Function | null>(null);
  const gameIdRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    socket.on('event_exception', setGameIdError);

    return () => {
      socket.off('event_exception', setGameIdError);
    };
  }, []);

  function onNewGame(nickname?: string) {
    if (!nickname) {
      clickedActionRef.current = onNewGame;
      return setEnterNameVisible(true);
    }

    socket.emit('create_game');
  }

  function onJoinGame(nickname?: string) {
    if (!nickname) {
      clickedActionRef.current = onJoinGame;
      return setEnterNameVisible(true);
    }

    socket.emit('join_game', gameIdRef.current!.value);
  }

  function onNicknameSave(nickname: string) {
    clickedActionRef.current?.(nickname);
  }

  return (
    <>
      <EnterNickname enterNameVisible={enterNameVisible}
                     setEnterNameVisible={setEnterNameVisible}
                     onNicknameSave={onNicknameSave} />
      <div className={style.container}>
        <h1>BRICKS BATTLE</h1>
        {nickname && <div className={style.nicknameBox}>
          Hi, {nickname}!
        </div>}
        <button onClick={() => onNewGame(nickname)}>Create game</button>
        <div className={style.separator}>
          or
        </div>
        <input type={'text'} placeholder={'Enter game code'} ref={gameIdRef} />
        <div className={style.error}>
          {gameIdError}
        </div>
        <button onClick={() => onJoinGame(nickname)}>Join game</button>
      </div>
    </>
  );
}