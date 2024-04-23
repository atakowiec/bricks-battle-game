import style from '../MapHub.module.scss';
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IMapBlock } from '@shared/Map.ts';
import { MapPreview } from './MapPreview.tsx';
import { produce } from 'immer';
import { EditorTools } from './EditorTools.tsx';
import { BottomButtons } from './BottomButtons.tsx';
import getApi from '../../../api/axios.ts';
import title from '../../../utils/title.ts';
import { useDispatch } from 'react-redux';
import { layoutActions } from '../../../store/layoutSlice.ts';
import useSelector from '../../../hooks/useSelector.ts';

export interface MapEditorState {
  name: string;
  difficulty: string;
  tool: ToolTypes;
  block?: IMapBlock;
  size: number;
  map: string[][];
}

export type ToolTypes = 'pen' | 'eraser' | 'fill';

export interface StateProps {
  state: MapEditorState;
  setState: Dispatch<SetStateAction<MapEditorState>>;
  onSizeChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

function emptyMap(size: number): string[][] {
  return Array.from({ length: size * 0.7 }).map(() => emptyRow(size));
}

function emptyRow(size: number): string[] {
  return Array.from({ length: size }).map(() => '0');
}

export default function MapEditor() {
  title('Map editor')
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const [state, setState] = useState<MapEditorState>({
    name: '',
    difficulty: 'easy',
    tool: 'pen',
    size: 20,
    map: emptyMap(20),
  });

  useEffect(() => {
    if (!user.loggedIn) {
      dispatch(layoutActions.setTab('main'));
    }
  }, [user.loggedIn]);

  if (!user.loggedIn) {
    return <></>;
  }

  function saveMap() {
    // first encode map to string
    const mapString = state.map.map(row => row.join('')).join('');

    getApi().post('/maps', {
      name: state.name,
      difficulty: state.difficulty,
      data: mapString,
      size: state.size,
    }).then(() => {
      dispatch(layoutActions.setTab('map-hub'));
    }).catch((e) => {
      console.log(e);
    });
  }

  function onSizeChange(event: ChangeEvent<HTMLInputElement>) {
    const input = parseInt(event.target.value);
    if (input < 15 || input > 40) return;

    setState(prevState => {
      // forceSize does not modify passed array in arr argument
      function forceSize(arr: any[], size: number, emptyElement: any) {
        if (arr.length > size)
          return arr.slice(0, size);
        while (arr.length < size)
          arr = produce(arr, draft => {
            draft.push(typeof emptyElement == 'object' ? [...emptyElement] : emptyElement);
          });

        return arr;
      }

      let newMap = prevState.map;
      const newHeight = input * 0.7;

      newMap = forceSize(newMap, newHeight, Array.from({ length: input }).map(() => '0'));
      newMap = newMap.map(row => forceSize(row, input, '0'));

      return { ...prevState, size: input, map: newMap };
    });
  }

  return (
    <div className={`${style.editorBox}`}>
      <div className={'d-flex'}>
        <MapPreview state={state} setState={setState} />
        <EditorTools state={state} setState={setState} onSizeChange={onSizeChange} />
      </div>
      <BottomButtons state={state} setState={setState} saveMap={saveMap} />
    </div>
  );
}