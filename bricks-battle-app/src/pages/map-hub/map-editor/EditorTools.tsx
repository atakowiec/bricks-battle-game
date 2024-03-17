import useSelector from '../../../hooks/useSelector.ts';
import { IMapBlock } from '@shared/Map.ts';
import style from '../MapHub.module.scss';
import { ButtonSelector, SelectButton } from '../../../components/button-selector/ButtonSelector.tsx';
import { StateProps, ToolTypes } from './MapEditor.tsx';
import React, { ChangeEvent, MouseEvent } from 'react';

export function EditorTools(props: StateProps) {
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

  function onNameChange(event: ChangeEvent<HTMLInputElement>) {
    props.setState({ ...props.state, name: event.target.value });
  }

  return (
    <div className={style.toolsBox}>
      <h1>
        Map creator
      </h1>
      <div className={`${style.toolsInputsBox}`}>
        <input type={'text'}
               placeholder={'map name'}
               defaultValue={props.state.name}
               onChange={onNameChange} />
        <input type={'number'}
               placeholder={'size'}
               defaultValue={20}
               max={40}
               min={15}
               onChange={props.onSizeChange} />
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
          .map(block => <BlockSelectorButton block={block}
                                             key={block.id}
                                             active={props.state.block == block}
                                             onClick={setBlock} />)}
      </div>
      <h4>
        Unreakable blocks
      </h4>
      <div className={'flex-wrap d-flex'}>
        {blocks.filter(block => block.unbreakable)
          .map(block => <BlockSelectorButton block={block}
                                             key={block.id}
                                             active={props.state.block == block}
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