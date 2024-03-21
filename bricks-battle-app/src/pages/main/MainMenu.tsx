import style from './MainMenu.module.scss';
import title from '../../utils/title.ts';
import { useEffect, useRef, useState } from 'react';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import useSelector from '../../hooks/useSelector.ts';
import getApi from '../../api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice.ts';
import useSocket from '../../socket/useSocket.ts';

export default function MainMenu() {
  title('Main Menu');
  const socket = useSocket();
  const dispatch = useDispatch();

  const nickname = useSelector(state => state.user.nickname);

  const [enterNameVisible, setEnterNameVisible] = useState(false);
  const [nicknameError, setNicknameError] = useState('');
  const [gameIdError, setGameIdError] = useState('');

  const nicknameRef = useRef<HTMLInputElement>(null);
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

  function saveNickname() {
    const nickname = nicknameRef.current!.value;

    getApi().post('/auth/nickname', { nickname })
      .then(() => {
        setEnterNameVisible(false);
        setNicknameError('');
        dispatch(userActions.setUser({ nickname }));
        socket.connect();

        if (clickedActionRef.current) clickedActionRef.current(nickname);
      })
      .catch(err => {
        console.log(err);
        setNicknameError(err.response.data.message);
      });
  }

  return (
    <>
      <FloatingContainer visible={enterNameVisible} setVisible={setEnterNameVisible}>
        <h1>
          Enter your nickname
        </h1>
        <div className={'col-8 mx-auto'}>
          <input type={'text'} placeholder={'nickname'} className={'text-center'} ref={nicknameRef} />
          {nicknameError && <div className={'pt-2'}>
            {nicknameError}
          </div>}
          <button onClick={saveNickname}>
            Save
          </button>
        </div>
      </FloatingContainer>
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