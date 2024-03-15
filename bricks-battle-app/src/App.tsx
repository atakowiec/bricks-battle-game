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
import MapHubTab from './pages/map-hub/MapHubTab.tsx';
import { commonDataActions } from './store/commonDataSlice.ts';

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

    getApi().get('/maps/blocks')
      .then((res: any) => {
        dispatch(commonDataActions.setMapBlocks(res.data));
      });
  }, []);

  if (stage === 'game') return <></>;

  const route = navbarRoutes[stage].find(route => route.id === tab);

  if(!route)
    return <></>;

  // unfortunately map hub uses a different container
  if(route.id === "map-hub") {
    return route.element;
  }

  return (
    <Container>
      <NavBar />
      {route.element || <></>}
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
      element: <MapHubTab />,
    },
  ],
  'game-lobby': [
    {
      id: 'game-lobby',
      element: <></>,
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
      element: <MapHubTab />,
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
