import { IMap, MapType } from '@shared/Map.ts';
import useSelector from '../../../hooks/useSelector.ts';
import style from '../MapHub.module.scss';
import useApi from '../../../hooks/useApi.ts';
import Button from '../../../components/Button.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../../../store/layoutSlice.ts';
import { MapImage } from './MapImage.tsx';
import { useRef, useState } from 'react';
import FloatingContainer from '../../../components/FloatingContainer.tsx';
import { InlineButtons } from '../../../components/InlineButtons.tsx';
import useSocket from '../../../socket/useSocket.ts';
import { EnterNickname } from '../../main/EnterNickname.tsx';

export function MapList(props: { mapCategory: MapType }) {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const game = useSelector(state => state.game);

  const { data, loaded } = useApi<IMap[]>('/maps/' + props.mapCategory, 'get');

  const [createGameConfirmVisible, setCreateGameConfirmVisible] = useState(false);
  const [enterNicknameVisible, setEnterNicknameVisible] = useState(false);

  const clickedMapRef = useRef<string | null>(null);
  const socket = useSocket();

  if (props.mapCategory === 'personal') {
    if (!user?.sub) {
      return (
        <div className={style.logInText}>
          Log in to see your maps here
        </div>
      );
    }
  }

  function onClick(_id: string) {
    clickedMapRef.current = _id;

    if (!game?.id) {
      // if player is not in a room, ask to create a new game
      setCreateGameConfirmVisible(true);
      return;
    }

    // if player is in a room, request map change (backend will handle the rest)
    socket.emit('change_map', _id, () => dispatch(layoutActions.setTab('main')));
  }

  function createGame(nickname?: string) {
    if (!clickedMapRef.current) return;
    setCreateGameConfirmVisible(false);

    if (!nickname) {
      setEnterNicknameVisible(true);
      return;
    }

    // create a new game with the selected map
    socket.emit('create_game', clickedMapRef.current, () => dispatch(layoutActions.setTab('main')));
  }

  return (
    <>
      <EnterNickname enterNameVisible={enterNicknameVisible}
                     setEnterNameVisible={setEnterNicknameVisible}
                     onNicknameSave={createGame} />
      <FloatingContainer visible={createGameConfirmVisible} setVisible={setCreateGameConfirmVisible}>
        <h1>
          CREATE GAME
        </h1>
        <p>
          Do you want to create a new game with this map?
        </p>
        <InlineButtons>
          <Button onClick={() => createGame(user?.nickname)}>Yes</Button>
          <Button type={'secondary'} onClick={() => setCreateGameConfirmVisible(false)}>No</Button>
        </InlineButtons>
      </FloatingContainer>
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
          <Loading />
          : !data ?
            <div className={style.noMaps}>No maps available :(</div>
            :
            <div className={style.mapList} style={{ paddingRight: (data?.length ?? 0) > 2 ? '5px' : '' }}>
              {data.map(map => <MapCard key={map._id}
                                        mapCategory={props.mapCategory}
                                        map={map}
                                        onClick={() => onClick(map._id)} />)}
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

function MapCard(props: { map: IMap, mapCategory: MapType, onClick: () => void }) {
  const game = useSelector(state => state.game);
  const isNotOwner = game?.player?.owner === false;
  const isSelected = game?.map?._id === props.map._id;

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
        </div>
        {!isNotOwner && <Button onClick={props.onClick}
                                width={"auto"}
                                disabled={isSelected}
                                type={'secondary'}>{isSelected ? 'Selected' : 'Play'}</Button>}
      </div>
    </div>
  );
}