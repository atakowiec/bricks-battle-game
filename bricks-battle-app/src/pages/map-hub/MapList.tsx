import { MapHubPageProps } from './MapHubTab.tsx';
import { useState } from 'react';
import { ButtonSelector, SelectButton } from '../../components/button-selector/ButtonSelector.tsx';
import { MapType } from '@shared/Map.ts';
import style from './MapHub.module.scss';

const mapCategories = [
  'official',
  'community',
  'personal',
];

export default function MapList(props: MapHubPageProps) {
  const [mapCategory, setMapCategory] = useState<MapType>('official');
  // I will use this later after maps editing is implemented
  // const { data, loaded } = useApi('/maps/' + mapCategory, 'get');

  return (
    <>
      <h1>Map Hub</h1>
      <ButtonSelector active={mapCategory} setActive={setMapCategory}>
        {mapCategories.map(category => <SelectButton className={'text-capitalize'} id={category}
                                                     key={category}>{category}</SelectButton>)}
      </ButtonSelector>
      {
        mapCategory == 'personal' &&
        <div className={'text-center'}>
          <button className={style.addMapButton} onClick={() => props.setMapEditor(true)}>
            Create map
          </button>
        </div>
      }
    </>
  );
}