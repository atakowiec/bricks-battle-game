import { MapHubPageProps } from '../MapHubTab.tsx';
import style from '../MapHub.module.scss';
import { ButtonSelector, SelectButton } from '../../../components/button-selector/ButtonSelector.tsx';
import { ChangeEvent, useState } from 'react';
import useSelector from '../../../hooks/useSelector.ts';
import { IMapBlock } from '@shared/Map.ts';
import NavBar from '../../../components/NavBar.tsx';
import { MapPreview } from './MapPreview.tsx';

interface MapEditorState {
  difficulty: string;
  tool: ToolTypes;
  block?: IMapBlock;
  size: number;
  map: string;
}

export type ToolTypes = 'pen' | 'eraser' | 'fill';

export interface StateProps {
  state: MapEditorState;
  setState: (state: MapEditorState) => void;
  onSizeChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

export default function MapEditor(props: MapHubPageProps) {
  const [state, setState] = useState<MapEditorState>({
    difficulty: 'easy',
    tool: 'pen',
    size: 20,
    map: Array.from({ length: 400 }).map(() => '0').join(''),
  });

  function onSizeChange(event: ChangeEvent<HTMLInputElement>) {
    const input = parseInt(event.target.value);
    if (input < 15 || input > 35) return;

    setState(prevState => {
      const regex = new RegExp(`.{1,${input}}`, 'g');
      const lines = prevState.map.match(regex)!;
      const maxLines = Math.floor(prevState.size * 0.7);
      let newMap = [...lines];

      // Add or remove lines to match the new size
      if (lines.length > maxLines) {
        newMap = lines.slice(0, maxLines);
        console.log('cutting ' + lines.length + ' to ' + maxLines);
      } else if (lines.length < maxLines) {
        newMap = [...newMap, ...Array.from({ length: maxLines - lines.length }).map(() => '0'.repeat(input))];
      }

      // Add or remove columns to match the new size
      newMap = newMap.map(line => {
        if (line.length > input) {
          console.log('cutting ' + line.length + ' to ' + input);
          return line.slice(0, input);
        } else {
          return line + '0'.repeat(input - line.length);
        }
      });

      return { ...prevState, size: input, map: newMap.join('') };
    });

  }

  return (
    <div className={`${style.editorBox}`}>
      <NavBar />
      <MapPreview state={state} setState={setState} />
      <EditorTools {...props} state={state} setState={setState} onSizeChange={onSizeChange} />
    </div>
  );
}

function EditorTools(props: MapHubPageProps & StateProps) {
  const blocks = Object.values(useSelector(state => state.commonData.blocks)) as IMapBlock[];

  function setDifficulty(difficulty: string) {
    props.setState({ ...props.state, difficulty });
  }

  function setTool(tool: ToolTypes) {
    props.setState({ ...props.state, tool });
  }

  function setBlock(block: IMapBlock) {
    props.setState({ ...props.state, block: block });
  }

  return (
    <div className={style.toolsBox}>
      <h1>
        Map creator
      </h1>
      <div className={`${style.toolsInputsBox}`}>
        <input type={'text'} placeholder={'map name'} />
        <input type={'number'} placeholder={'size'} defaultValue={20} max={35} min={15} onChange={props.onSizeChange} />
      </div>
      <h4>
        Difficulty
      </h4>
      <div>
        <ButtonSelector active={props.state.difficulty} setActive={setDifficulty}>
          <SelectButton id={'easy'} className={style.selectButton}>Easy</SelectButton>
          <SelectButton id={'normal'} className={style.selectButton}>Normal</SelectButton>
          <SelectButton id={'hard'} className={style.selectButton}>Hard</SelectButton>
        </ButtonSelector>
      </div>
      <h4>
        Tools
      </h4>
      <ButtonSelector active={props.state.tool} setActive={setTool} className={style.toolsFlex}>
        <SelectButton id={'pen'} className={style.selectButton}>
          <img src={'/assets/pencil.png'} alt={'pen'} />
        </SelectButton>
        <SelectButton id={'eraser'} className={style.selectButton}>
          <img src={'/assets/eraser.png'} alt={'eraser'} />
        </SelectButton>
        <SelectButton id={'fill'} className={style.selectButton}>
          <img src={'/assets/fill.png'} alt={'fill'} />
        </SelectButton>
      </ButtonSelector>
      <h4>
        Breakable blocks
      </h4>
      <div className={'flex-wrap d-flex'}>
        {blocks.filter(block => !block.unbreakable)
          .map(block => <BlockSelectorButton block={block} key={block.id} active={props.state.block == block}
                                             onClick={setBlock} />)}
      </div>
      <h4>
        Unreakable blocks
      </h4>
      <div className={'flex-wrap d-flex'}>
        {blocks.filter(block => block.unbreakable)
          .map(block => <BlockSelectorButton block={block} key={block.id} active={props.state.block == block}
                                             onClick={setBlock} />)}
      </div>
    </div>
  );
}

interface BlockSelectorButtonProps {
  block: IMapBlock;
  active: boolean;
  onClick: (block: IMapBlock) => void;
}

function BlockSelectorButton(props: BlockSelectorButtonProps) {
  function onClick() {
    props.onClick(props.block);
  }

  return (
    <div onClick={onClick}
         className={`${style.colorButton} ${props.active ? style.active : ''}`}
         style={{ background: props.block.data }}></div>
  );
}