import { MapHubPageProps } from '../MapHubTab.tsx';
import { IMap, MapType } from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from '../MapHub.module.scss';
import useApi from '../../../hooks/useApi.ts';

export function MapList(props: MapHubPageProps & { mapCategory: MapType }) {
  const user = useSelector(state => state.user);
  const { data, loaded } = useApi<IMap>('/maps/' + props.mapCategory, 'get');
  console.log(data);
  if(!loaded) {
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

    return (
      <div className={'text-center'}>
        <button className={style.addMapButton} onClick={() => props.setMapEditor(true)}>
          Create map
        </button>
      </div>
    );
  }
}