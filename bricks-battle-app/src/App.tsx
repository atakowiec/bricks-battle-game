import { ReactNode, useEffect } from 'react';
import useSelector from './hooks/useSelector.ts';
import getApi from './api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from './store/userSlice.ts';
import { commonDataActions } from './store/commonDataSlice.ts';
import { MenuRouter } from './pages/MenuRouter.tsx';
import { GameRouter } from './pages/GameRouter.tsx';
import NotificationsMain from './components/NotificationsMain.tsx';

function App() {
  const game = useSelector(state => state.game);
  const dispatch = useDispatch();

  useEffect(() => {
    getApi().post('/auth/verify')
      .then((res: any) => {
        dispatch(userActions.setUser(res.data));
      })
      .catch(() => {
        dispatch(userActions.setUser(null));
      });

    getApi().get('/maps/blocks')
      .then((res: any) => {
        dispatch(commonDataActions.setMapBlocks(res.data));
      });
  }, []);

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
