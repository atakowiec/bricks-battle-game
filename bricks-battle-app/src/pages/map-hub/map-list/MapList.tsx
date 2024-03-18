import { MapHubPageProps } from '../MapHubTab.tsx';
import { IMap, MapType } from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from '../MapHub.module.scss';
import useApi from '../../../hooks/useApi.ts';
import Button from '../../../components/Button.tsx';
import { useMemo } from 'react';
import { encodeMap } from '../../../utils/utils.ts';

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

      <div className={style.mapList} style={{paddingRight: (data?.length ?? 0) > 2 ? "5px" : ""}}>
        {data && data.map(map => <MapCard key={map._id} mapCategory={props.mapCategory} map={map} />)}
      </div>
    </>
  );
}

function MapCard(props: { map: IMap, mapCategory: MapType }) {
  return (
    <div className={style.mapCard}>
      <MapImage map={props.map} />
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

function MapImage(props: { map: IMap }) {
  const mapColors = useMemo(() => encodeMap(props.map), [props.map.data, props.map.size]);
  const mapBlocks = useSelector(state => state.commonData.blocks);
  const arr = Array.from({ length: props.map.size });

  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <rect x={0} y={0} width={20} height={20} fill="#00000070" />
      {arr.map((_, y) => arr.map((_, x) => {
        const blockId = mapColors[y]?.[x] ?? '0';
        const blockColor = mapBlocks[blockId]?.data ?? undefined;

        if (!blockColor) return <></>;

        return (
          <rect
            key={y * props.map.size + x}
            x={x}
            y={y}
            width={1}
            height={1}
            fill={blockColor}
          />
        );
      }))}
    </svg>
  );
}