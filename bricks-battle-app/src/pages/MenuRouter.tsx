import MainMenu from './main/MainMenu.tsx';
import AccountTab from './account/AccountTab.tsx';
import Gadgets from './gadgets/Gadgets.tsx';
import NavBar from '../components/NavBar.tsx';
import useSelector from '../hooks/useSelector.ts';
import { NavbarRoute } from '../App.tsx';
import MapEditor from './map-hub/map-editor/MapEditor.tsx';
import { Container } from '../components/Container.tsx';
import MapListPage from './map-hub/map-list/MapListPage.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../store/layoutSlice.ts';
import { useEffect } from 'react';

const routes: NavbarRoute[] = [
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
    element: <MapListPage />,
  },
];

export function MenuRouter() {
  const tab = useSelector(state => state.layout.tab);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tab === 'map-editor') return;
    if (!(!tab || !routes.find(route => route.id === tab))) return;

    dispatch(layoutActions.setTab('main'));
  }, [tab]);

  if (tab === 'map-editor')
    return <MapEditor />;

  const route = routes.find(route => route.id === tab);

  if (!route)
    return <></>;

  return (
    <Container>
      <NavBar routes={routes} />
      {route.element || <></>}
    </Container>
  );
}