import MainMenu from './pages/main/MainMenu.tsx';

import { ReactNode, useEffect } from 'react';
import useSelector from './hooks/useSelector.ts';
import { Container } from './components/Container.tsx';
import NavBar from './components/NavBar.tsx';
import AccountTab from './pages/account/AccountTab.tsx';
import Gadgets from './pages/gadgets/Gadgets.tsx';
import getApi from './api/axios.ts';
import { useDispatch } from 'react-redux';
import { userActions } from './store/userSlice.ts';

function App() {
  const stage = useSelector(state => state.layout.stage);
  const tab = useSelector(state => state.layout.tab);
  const dispatch = useDispatch();

  useEffect(() => {
    getApi().post('/auth/verify')
      .then((res: any) => {
        dispatch(userActions.setUser(res.data));
      })
      .catch(() => {
        dispatch(userActions.setUser(null));
      });
  });

  if (stage === 'game') return <></>;

  return (
    <Container>
      <NavBar />
      {navbarRoutes[stage].find(route => route.id === tab)?.element || <></>}
    </Container>
  );
}

export const navbarRoutes: { [key: string]: NavbarRoute[] } = {
  'main': [
    {
      id: 'main',
      element: <MainMenu />,
    },
    {
      id: 'account',
      element: <AccountTab />,
    },
    {
      id: 'personalize',
      element: <Gadgets />,
    },
    {
      id: 'map-hub',
      element: <></>,
    },
  ],
  'game-lobby': [
    {
      id: 'game-lobby',
      element: <></>,
    },
    {
      id: 'account',
      element: <></>,
    },
    {
      id: 'personalize',
      element: <></>,
    },
    {
      id: 'map-hub',
      element: <></>,
    },
    {
      id: 'settings',
      element: <></>,
    },
  ],
};

export interface NavbarRoute {
  id: string;
  element: ReactNode;
}

export default App;
