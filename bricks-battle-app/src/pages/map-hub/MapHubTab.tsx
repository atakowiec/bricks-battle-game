import { useState } from 'react';
import MapEditor from './MapEditor.tsx';
import MapList from './MapList.tsx';

export interface MapHubPageProps {
  setMapEditor: (mapEditor: boolean) => void;
}

export default function MapHubTab() {
  const [mapEditor, setMapEditor] = useState(false);

  return mapEditor ? <MapEditor setMapEditor={setMapEditor} /> : <MapList setMapEditor={setMapEditor} />;
}