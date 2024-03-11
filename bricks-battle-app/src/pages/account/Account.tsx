import style from './Account.module.scss';
import useSelector from '../../hooks/useSelector.ts';
import getApi from '../../api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from '../../store/userSlice.ts';

export default function Account() {
  const user = useSelector((state) => state.user)!;
  const dispatch = useDispatch();

  console.log(user);

  const logout = () => {
    getApi().post('/auth/logout')
      .then(() => dispatch(userActions.setUser(null)))
      .catch((e) => console.error(e));
  };

  return (
    <div className={`${style.accountBox} ${style.container}`}>
      <h1>Account</h1>
      <div className={style.nameBox}>
        <div className={style.profileIcon}>
          <img src={'/assets/icon.png'} alt={'profile'} />
        </div>
        <div className={style.name}>
          {user.nickname}
        </div>
      </div>
      <div className={style.buttonsBox}>
        <button>Change password</button>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
}