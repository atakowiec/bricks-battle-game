import style from './GameLobby.module.scss';
import title from '../../../utils/title.ts';
import useSelector from '../../../hooks/useSelector.ts';
import FloatingContainer from '../../../components/FloatingContainer.tsx';
import { useState } from 'react';
import Button from '../../../components/Button.tsx';
import useSocket from '../../../socket/useSocket.ts';
import { MapImage } from '../../map-hub/map-list/MapImage.tsx';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../../../store/layoutSlice.ts';
import useNotifications from '../../../hooks/useNotifications.ts';
import { InlineButtons } from '../../../components/InlineButtons.tsx';

export function GameLobby() {
  title('Game Lobby');
  const game = useSelector(state => state.game)!;
  const dispatch = useDispatch();
  const socket = useSocket();
  const { addNotification } = useNotifications();

  function onMapClick() {
    if (!game.player.owner)
      return addNotification('Only the owner can change the map!', 'error');

    dispatch(layoutActions.setTab('map-hub'));
  }

  function leaveGame() {
    socket.emit('leave_game');
  }

  function startGame() {
    if (game.player.owner)
      socket.emit('start_game');
  }

  return (
    <>
      <h1>Game Lobby</h1>
      <div className={style.gameId}>ID: {game.id}</div>
      <div className={style.membersBox}>
        <MemberCard owner={true} />
        <MemberCard owner={false} />
      </div>

      <div className={style.mapImage}>
        <MapImage map={game.map} onClick={onMapClick} />
      </div>

      <InlineButtons>
        <Button disabled={!game.player.owner} onClick={startGame}>Start game</Button>
        <Button type={'secondary'} width={'auto'}
                onClick={leaveGame}>{game.player.owner ? 'Delete game' : 'Leave game'}</Button>
      </InlineButtons>
    </>
  );
}

function MemberCard(props: { owner: boolean }) {
  const gameMember = useSelector(state => {
    const game = state.game!;
    if (props.owner)
      return game.player.owner ? game.player : game.opponent;

    return game.player.owner ? game.opponent : game.player;
  });
  const isOwner = useSelector(state => state.game!.player.owner);
  const [kickConfirmVisible, setKickConfirmVisible] = useState(false);
  const socket = useSocket();

  function kick() {
    setKickConfirmVisible(false);

    if (!gameMember || props.owner)
      return;

    socket.emit('kick');
  }

  return (
    <div className={`${style.memberCard} ${gameMember?.online ? '' : style.empty}`}>
      {gameMember ?
        <>
          <img src={'/assets/icon.png'} alt="icon" />
          <div className={style.memberInfo}>
            <div className={style.memberName}>{gameMember.nickname}</div>
            {gameMember.online && !props.owner && isOwner && (
              <>
                <FloatingContainer visible={kickConfirmVisible} setVisible={setKickConfirmVisible}>
                  <h1>
                    Kick {gameMember.nickname}?
                  </h1>
                  <div className={style.kickConfirmButtons}>
                    <Button onClick={kick}>KICK</Button>
                    <Button type={'secondary'} onClick={() => setKickConfirmVisible(false)}>CANCEL</Button>
                  </div>
                </FloatingContainer>
                <div onClick={() => setKickConfirmVisible(true)} className={style.kickOverlay}>KICK</div>
              </>
            )}
          </div>
        </>
        :
        <div className={style.noMember}>
          <div>Waiting for player...</div>
        </div>
      }
    </div>
  );
}