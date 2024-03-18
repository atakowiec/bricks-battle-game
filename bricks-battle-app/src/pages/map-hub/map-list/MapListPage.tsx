import { useState } from 'react';
import { ButtonSelector, SelectButton } from '../../../components/button-selector/ButtonSelector.tsx';
import { MapType } from '@shared/Map.ts';
import { MapList } from './MapList.tsx';
import title from '../../../utils/title.ts';

const mapCategories = [
  'official',
  'community',
  'personal',
];

export default function MapListPage() {
  title('Map Hub');

  const [mapCategory, setMapCategory] = useState<MapType>('official');

  return (
    <>
      <h1>Map Hub</h1>
      <ButtonSelector active={mapCategory} setActive={setMapCategory}>
        {mapCategories.map(category => <SelectButton className={'text-capitalize'} id={category}
                                                     key={category}>{category}</SelectButton>)}
      </ButtonSelector>
      <MapList mapCategory={mapCategory} />
    </>
  );
}