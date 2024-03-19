import { ReactNode, useEffect, useState } from 'react';
import useSelector from './hooks/useSelector.ts';
import getApi from './api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from './store/userSlice.ts';
import { commonDataActions } from './store/commonDataSlice.ts';
import { MenuRouter } from './pages/MenuRouter.tsx';
import { GameRouter } from './pages/GameRouter.tsx';
import NotificationsMain from './components/NotificationsMain.tsx';
import useSocket from './socket/useSocket.ts';
import useNotifications from './hooks/useNotifications.ts';

function App() {
  const game = useSelector(state => state.game);
  const dispatch = useDispatch();
  const socket = useSocket();
  const { addNotification } = useNotifications();
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    getApi().post('/auth/verify')
      .then((res: any) => {
        dispatch(userActions.setUser(res.data));
        setUserLoaded(true);
        socket.connect();
      })
      .catch(e => {
        dispatch(userActions.setUser(null));
        setUserLoaded(true);

        const status = e.response?.status;
        if (status === 401) return;

        addNotification(e.response.data.message, 'error');
      });

    getApi().get('/maps/blocks')
      .then((res: any) => {
        dispatch(commonDataActions.setMapBlocks(res.data));
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  if (!userLoaded) return null;

  return (
    <>
      <NotificationsMain />
      {game ? <GameRouter /> : <MenuRouter />}
    </>
  );
}

export interface NavbarRoute {
  id: string;
  element: ReactNode;
}

export default App;
