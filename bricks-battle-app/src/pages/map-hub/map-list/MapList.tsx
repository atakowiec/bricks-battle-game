import { MapHubPageProps } from '../MapHubTab.tsx';
import { IMap, MapType } from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from '../MapHub.module.scss';
import useApi from '../../../hooks/useApi.ts';
import Button from '../../../components/Button.tsx';

export function MapList(props: MapHubPageProps & { mapCategory: MapType }) {
  const user = useSelector(state => state.user);
  const { data, loaded } = useApi<IMap[]>('/maps/' + props.mapCategory, 'get');
  console.log(data);

  if (!loaded) {
    return <div>Loading...</div>;
  }

  if (props.mapCategory === 'personal') {
    if (!user?.sub) {
      return (
        <div className={style.logInText}>
          Log in to see your maps here
        </div>
      );
    }
  }

  return (
    <>
      {
        props.mapCategory === 'personal' &&
        <div className={'text-center'}>
          <button className={style.addMapButton} onClick={() => props.setMapEditor(true)}>
            Create map
          </button>
        </div>
      }

      <div className={style.mapList}>
        {data && data.map(map => <MapCard key={map._id} mapCategory={props.mapCategory} map={map} />)}
      </div>
    </>
  );
}

function MapCard(props: { map: IMap, mapCategory: MapType }) {
  return (
    <div className={style.mapCard}>
      <img src={'https://placehold.co/400'} alt={'placeholder'} />
      <div className={style.mapCardInfo}>
        <div>
          <h3>{props.map.name}</h3>
          {
            props.mapCategory === 'community' &&
            <div className={style.author}>
              by {props.map.owner.nickname}
            </div>
          }
        </div>
        <div className={style.cardBottomBox}>
          <div className={style.difficulty}>
            {props.map.difficulty}
          </div>
          <Button type={'secondary'}>Play</Button>
        </div>
      </div>
    </div>
  );
}