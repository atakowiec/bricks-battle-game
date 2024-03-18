import MainMenu from './main/MainMenu.tsx';
import AccountTab from './account/AccountTab.tsx';
import Gadgets from './gadgets/Gadgets.tsx';
import MapHubTab from './map-hub/MapHubTab.tsx';
import NavBar from '../components/NavBar.tsx';
import useSelector from '../hooks/useSelector.ts';
import { NavbarRoute } from '../App.tsx';
import MapEditor from './map-hub/map-editor/MapEditor.tsx';
import { Container } from '../components/Container.tsx';

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
    element: <MapHubTab />,
  },
];

export function MenuRouter() {
  const tab = useSelector(state => state.layout.tab);

  if(tab === "map-editor")
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