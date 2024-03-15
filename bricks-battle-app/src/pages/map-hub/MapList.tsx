import { MapHubPageProps } from './MapHubTab.tsx';
import { useState } from 'react';
import { ButtonSelector, SelectButton } from '../../components/button-selector/ButtonSelector.tsx';
import { MapType } from '@shared/Map.ts';
import style from './MapHub.module.scss';
import useSelector from '../../hooks/useSelector.ts';
import { Container } from '../../components/Container.tsx';
import NavBar from '../../components/NavBar.tsx';

const mapCategories = [
  'official',
  'community',
  'personal',
];

export default function MapListPage(props: MapHubPageProps) {
  const [mapCategory, setMapCategory] = useState<MapType>('official');
  // I will use this later after maps editing is implemented
  // const { data, loaded } = useApi('/maps/' + mapCategory, 'get');

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

function MapList(props: MapHubPageProps & { mapCategory: MapType }) {
  const user = useSelector(state => state.user);

  if (props.mapCategory === 'personal') {
    if (!user?.sub) {
      return (
        <div className={style.logInText}>
          Log in to see your maps here
        </div>
      );
    }

    return (
      <div className={'text-center'}>
        <button className={style.addMapButton} onClick={() => props.setMapEditor(true)}>
          Create map
        </button>
      </div>
    );
  }
}