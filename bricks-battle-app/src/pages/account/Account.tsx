import style from './Account.module.scss';
import useSelector from '../../hooks/useSelector.ts';
import getApi from '../../api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice.ts';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import { useRef, useState } from 'react';
import title from '../../utils/title.ts';
import useSocket from '../../socket/useSocket.ts';
import { selectedGadgetStyle } from '../../utils/utils.ts';

export default function Account() {
  title('Your Account');

  const user = useSelector((state) => state.user)!;
  const dispatch = useDispatch();
  const [changePasswordVisible, setChangePasswordVisible] = useState(false);
  const socket = useSocket();
  const selectedIcon = useSelector((state) => state.gadgets).icon;

  const logout = () => {
    getApi().post('/auth/logout')
      .then(() => {
        socket.disconnect();
        return dispatch(userActions.setUser(null));
      })
      .catch((e) => console.error(e));
  };

  return (
    <>
      <ChangePasswordBox visible={changePasswordVisible} setVisible={setChangePasswordVisible} />
      <div className={`${style.accountBox} ${style.container}`}>
        <h1>Account</h1>
        <div className={style.nameBox}>
          <div className={style.profileIcon}>
            <div style={selectedGadgetStyle(selectedIcon)}/>
          </div>
          <div className={style.name}>
            {user.nickname}
          </div>
        </div>
        <div className={style.buttonsBox}>
          <button onClick={() => setChangePasswordVisible(true)}>Change password</button>
          <button onClick={logout}>Logout</button>
        </div>
      </div>
    </>
  );
}

function ChangePasswordBox({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
  const oldPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordConfirmRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  function onSubmit() {
    const oldPassword = oldPasswordRef.current!.value;
    const newPassword = newPasswordRef.current!.value;
    const newPasswordConfirm = newPasswordConfirmRef.current!.value;

    if (!oldPassword || !newPassword || !newPasswordConfirm) return setError('All fields are required');

    if (newPassword !== newPasswordConfirm) {
      setError('New password and confirm password do not match');
      return;
    }

    getApi().post('/auth/change-password', { oldPassword, newPassword })
      .then(() => setVisible(false))
      .catch((e) => setError(e.response.data.message));
  }

  return (
    <FloatingContainer visible={visible}
                       setVisible={setVisible}
                       width={'auto'}
                       className={style.changePasswordBox}>
      <h1>Change password</h1>
      <div className={style.inputBox}>
        <label htmlFor={'oldPassword'}>Old password</label>
        <input type={'password'} id={'oldPassword'} ref={oldPasswordRef} />
      </div>
      <div className={style.inputBox}>
        <label htmlFor={'newPassword'}>New password</label>
        <input type={'password'} id={'newPassword'} ref={newPasswordRef} />
      </div>
      <div className={style.inputBox}>
        <label htmlFor={'newPasswordConfirm'}>Confirm new password</label>
        <input type={'password'} id={'newPasswordConfirm'} ref={newPasswordConfirmRef} />
      </div>
      <div className={style.error}>
        {error}
      </div>
      <button onClick={onSubmit}>Change password</button>
    </FloatingContainer>
  );
}