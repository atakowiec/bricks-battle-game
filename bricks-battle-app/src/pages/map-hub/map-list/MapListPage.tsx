import { MapHubPageProps } from '../MapHubTab.tsx';
import { useState } from 'react';
import { ButtonSelector, SelectButton } from '../../../components/button-selector/ButtonSelector.tsx';
import { MapType } from '@shared/Map.ts';
import { Container } from '../../../components/Container.tsx';
import NavBar from '../../../components/NavBar.tsx';
import { MapList } from './MapList.tsx';

const mapCategories = [
  'official',
  'community',
  'personal',
];

export default function MapListPage(props: MapHubPageProps) {
  const [mapCategory, setMapCategory] = useState<MapType>('official');

  return (
    <Container>
      <NavBar />
      <h1>Map Hub</h1>
      <ButtonSelector active={mapCategory} setActive={setMapCategory}>
        {mapCategories.map(category => <SelectButton className={'text-capitalize'} id={category}
                                                     key={category}>{category}</SelectButton>)}
      </ButtonSelector>
      <MapList {...props} mapCategory={mapCategory} />
    </Container>
  );
}