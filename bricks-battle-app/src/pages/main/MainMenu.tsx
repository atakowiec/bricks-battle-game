import style from './MainMenu.module.scss';
import title from '../../utils/title.ts';
import { useRef, useState } from 'react';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import useSelector from '../../hooks/useSelector.ts';
import getApi from '../../api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice.ts';
import useSocket from '../../socket/useSocket.ts';

export default function MainMenu() {
  title('Main Menu');
  const socket = useSocket()
  const dispatch = useDispatch();
  const [enterNameVisible, setEnterNameVisible] = useState(false);
  const nickname = useSelector(state => state.user.nickname);
  const nicknameRef = useRef<HTMLInputElement>(null);
  const clickedActionRef = useRef<Function | null>(null);
  const [nicknameError, setNicknameError] = useState('');

  function onNewGame(nickname?: string) {
    if (!nickname) {
      clickedActionRef.current = onNewGame;
      return setEnterNameVisible(true);
    }

    console.log('Creating new game');
  }

  function onJoinGame(nickname?: string) {
    if (!nickname) {
      clickedActionRef.current = onJoinGame;
      return setEnterNameVisible(true);
    }

    console.log('Joining game');
  }

  function saveNickname() {
    const nickname = nicknameRef.current!.value;

    getApi().post('/auth/nickname', { nickname })
      .then(() => {
        setEnterNameVisible(false);
        setNicknameError('');
        dispatch(userActions.setUser({ nickname }));
        socket.connect()

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
        <button onClick={() => onNewGame()}>Create game</button>
        <div className={style.separator}>
          or
        </div>
        <input type={'text'} placeholder={'Enter game code'} />
        <br />
        <button onClick={() => onJoinGame()}>Join game</button>
      </div>
    </>
  );
}