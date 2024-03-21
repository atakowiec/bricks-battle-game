import style from './Account.module.scss';
import { useRef, useState } from 'react';
import getApi from '../../api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice.ts';
import title from '../../utils/title.ts';
import useSocket from '../../socket/useSocket.ts';

export function Login() {
  title('Login');

  const [error, setError] = useState('');
  const loginRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const socket = useSocket();

  const login = () => {
    if (!loginRef.current?.value || !passwordRef.current?.value) {
      setError('Please fill all fields');
      return;
    }

    getApi().post('/auth/login', {
      nickname: loginRef.current.value,
      password: passwordRef.current.value,
    }).then((res) => {
      socket.connect();
      return dispatch(userActions.setUser(res.data));
    })
      .catch((e) => setError(e.response.data.message));
  };

  const register = () => {
    if (!loginRef.current?.value || !passwordRef.current?.value) {
      setError('Please fill all fields');
      return;
    }

    getApi().post('/auth/register', {
      nickname: loginRef.current.value,
      password: passwordRef.current.value,
    }).then((res) => {
      socket.connect();
      return dispatch(userActions.setUser(res.data));
    })
      .catch((e) => setError(e.response.data.message));
  };

  return (
    <div className={`${style.loginBox} ${style.container}`}>
      <h1>Login</h1>
      <input type={'text'} placeholder={'Username'} ref={loginRef} />
      <br />
      <input type={'password'} placeholder={'Password'} ref={passwordRef} />
      <div className={style.error}>
        {error}
      </div>
      <div className={style.buttonsBox}>
        <button onClick={login}>Login</button>
        <button onClick={register}>Register</button>
      </div>
    </div>
  );
}