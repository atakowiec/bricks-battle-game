import { Toggler } from '../../../components/Toggler.tsx';
import style from './Settings.module.scss';
import useSelector from '../../../hooks/useSelector.ts';
import { GameSettings, SettingType } from '@shared/Game.ts';
import useSocket from '../../../socket/useSocket.ts';

const settingTypes: { [_ in SettingType]: string } = {
  'drops_for_opponent': 'Drops for opponent',
  'drops_for_player': 'Drops for player',
  'positive_drops': 'Positive drops',
  'negative_drops': 'Negative drops',
};

export function Settings() {
  const settings = useSelector(state => state.game?.settings);
  const socket = useSocket();

  function onClick(key: keyof GameSettings) {
    return () => socket.emit('toggle_settings', key);
  }

  return (
    <div>
      <h1>Settings</h1>
      { Object.keys(settingTypes).map((key) => (
          <Toggler
            key={key}
            isToggled={!!settings?.[key as SettingType]}
            setIsToggled={onClick(key as SettingType)}
            className={style.settingsEntry}
            children_location={'left'}
          >
            {settingTypes[key as SettingType]}
          </Toggler>
        ))
      }
    </div>
  );
}