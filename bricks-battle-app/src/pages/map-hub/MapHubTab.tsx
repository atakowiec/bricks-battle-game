import { useState } from 'react';
import MapEditor from './map-editor/MapEditor.tsx';
import MapListPage from './map-list/MapListPage.tsx';

export interface MapHubPageProps {
  setMapEditor: (mapEditor: boolean) => void;
}

export default function MapHubTab() {
  const [mapEditor, setMapEditor] = useState(false);

  return mapEditor ? <MapEditor setMapEditor={setMapEditor} /> : <MapListPage setMapEditor={setMapEditor} />;
}