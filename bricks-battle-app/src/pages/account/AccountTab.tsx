import {Login} from "./Login.tsx";
import useSelector from '../../hooks/useSelector.ts';
import Account from './Account.tsx';

export default function AccountTab() {
    const loggedIn = !!useSelector(state => state.user);

    return loggedIn ? <Account /> : <Login />;
}