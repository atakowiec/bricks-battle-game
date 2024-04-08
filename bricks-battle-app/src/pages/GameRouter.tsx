import Gadgets from './gadgets/Gadgets.tsx';
import MapHubTab from './map-hub/MapHubTab.tsx';
import { Container } from '../components/Container.tsx';
import NavBar from '../components/NavBar.tsx';
import useSelector from '../hooks/useSelector.ts';
import { GameLobby } from './game/lobby/GameLobby.tsx';
import { NavbarRoute } from '../App.tsx';
import MapEditor from './map-hub/map-editor/MapEditor.tsx';
import { GameBox } from './game/game/GameBox.tsx';

const routes: NavbarRoute[] = [
  {
    id: 'main',
    element: <GameLobby />,
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
];

export function GameRouter() {
  const tab = useSelector(state => state.layout.tab);
  const game = useSelector(state => state.game);

  if(game?.status === 'playing') {
    return <GameBox />;
  }

  if(tab === "map-editor")
    return <MapEditor />;

  const route = routes.find(route => route.id === tab);

  if (!route) return <></>;

  return (
    <Container>
      <NavBar routes={routes} />
      {route.element || <></>}
    </Container>
  );
}