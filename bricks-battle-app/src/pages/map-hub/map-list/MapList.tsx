import {IMap, MapType} from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from '../MapHub.module.scss';
import useApi from '../../../hooks/useApi.ts';
import Button from '../../../components/Button.tsx';
import {useDispatch} from 'react-redux';
import {layoutActions} from '../../../store/layoutSlice.ts';
import {MapImage} from './MapImage.tsx';

export function MapList(props: { mapCategory: MapType }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const {data, loaded} = useApi<IMap[]>('/maps/' + props.mapCategory, 'get');

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
              <button className={style.addMapButton} onClick={() => dispatch(layoutActions.setTab('map-editor'))}>
                  Create map
              </button>
          </div>
      }

      {
        !loaded ?
          <Loading/>
          : !data ?
            <div className={style.noMaps}>No maps available :(</div>
            :
            <div className={style.mapList} style={{paddingRight: (data?.length ?? 0) > 2 ? '5px' : ''}}>
              {data.map(map => <MapCard key={map._id} mapCategory={props.mapCategory} map={map}/>)}
            </div>
      }
    </>
  );
}

function Loading() {
  return (
    <div className={style.loadingBox}>
      <div className={style.loadingElement}></div>
      <div className={style.loadingElement}></div>
      <div className={style.loadingElement}></div>
    </div>
  );
}

function MapCard(props: { map: IMap, mapCategory: MapType }) {
  return (
    <div className={style.mapCard}>
      <MapImage map={props.map}/>
      <div className={style.mapCardInfo}>
        <div>
          <h3>{props.map.name}</h3>
          {
            props.mapCategory === 'community' && props.map.owner &&
              <div className={style.author}>
                  by {props.map.owner?.nickname}
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