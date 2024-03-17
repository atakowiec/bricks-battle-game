import { useState } from 'react';
import MapEditor from './map-editor/MapEditor.tsx';
import MapListPage from './MapList.tsx';
import title from '../../utils/title.ts';

export interface MapHubPageProps {
  setMapEditor: (mapEditor: boolean) => void;
}

export default function MapHubTab() {
  title('Map Hub');
  const [mapEditor, setMapEditor] = useState(false);

  return mapEditor ? <MapEditor setMapEditor={setMapEditor} /> : <MapListPage setMapEditor={setMapEditor} />;
}