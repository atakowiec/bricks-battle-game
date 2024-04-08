import FloatingContainer from '../../components/FloatingContainer.tsx';
import { useRef, useState } from 'react';
import getApi from '../../api/axios.ts';
import { userActions } from '../../store/userSlice.ts';
import { useDispatch } from 'react-redux';
import useSocket from '../../socket/useSocket.ts';
import Button from '../../components/Button.tsx';

interface EnterNicknameProps {
  enterNameVisible: boolean;
  setEnterNameVisible: (value: boolean) => void;
  onNicknameSave: (nickname: string) => void;
}

export function EnterNickname(props: EnterNicknameProps) {
  const nicknameRef = useRef<HTMLInputElement>(null);
  const [nicknameError, setNicknameError] = useState('');
  const dispatch = useDispatch();
  const socket = useSocket();

  function saveNickname() {
    const nickname = nicknameRef.current!.value;

    getApi().post('/auth/nickname', { nickname })
      .then(() => {
        props.setEnterNameVisible(false);
        setNicknameError('');
        dispatch(userActions.setUser({ nickname }));
        socket.connect();

        props.onNicknameSave(nickname);
      })
      .catch(err => {
        console.log(err);
        setNicknameError(err.response.data.message);
      });
  }

  return (
    <FloatingContainer visible={props.enterNameVisible} setVisible={props.setEnterNameVisible}>
      <h1>
        Enter your nickname
      </h1>
      <div className={'col-8 mx-auto'}>
        <input type={'text'} placeholder={'nickname'} className={'text-center'} ref={nicknameRef} />
        {nicknameError && <div className={'pt-2'}>
          {nicknameError}
        </div>}
        <Button onClick={saveNickname}>
          Save
        </Button>
      </div>
    </FloatingContainer>
  );
}