import { DisplayType, GadgetType, IGadget } from '@shared/Gadgets.ts';
import style from './Gadgets.module.scss';
import Button from '../../components/Button.tsx';
import useApi from '../../hooks/useApi.ts';
import { InlineButtons } from '../../components/InlineButtons.tsx';
import { useRef, useState } from 'react';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import { ButtonSelector, SelectButton } from '../../components/button-selector/ButtonSelector.tsx';
import getApi from '../../api/axios.ts';

interface GadgetsSelectorProps {
  type: GadgetType;
  back: () => void;
}

export function GadgetsSelector(props: GadgetsSelectorProps) {
  const { data, loaded } = useApi<IGadget[]>(`/gadgets/all/${props.type}`, 'get');
  const [editorVisible, setEditorVisible] = useState(false);

  return (
    <>
      <Editor editorVisible={editorVisible} setEditorVisible={setEditorVisible} type={props.type} />
      <div className={`${style.container} text-center`}>
        <h1>{props.type}</h1>
        <InlineButtons className={'mb-4'}>
          <Button onClick={props.back} width={'auto'} className={'px-5'}>Back</Button>
          <Button type={'secondary'} width={'auto'} className={'px-4'}
                  onClick={() => setEditorVisible(true)}>Add</Button>
        </InlineButtons>
        {loaded && !data?.length && <h5>No items available</h5>}
        {!!data?.length && <GadgetsList gadgets={data} />}
      </div>
    </>
  );
}

function GadgetsList(props: { gadgets: IGadget[] }) {
  return (
    <div className={style.gadgetsList}>
      {props.gadgets.map(gadget => (
        <div className={style.gadget} key={gadget._id}>
          {gadget.displayType === 'color' ?
            <div className={`${style[`${gadget.type}Gadget`]}`}
                 style={{ backgroundColor: gadget.data }}>
            </div> :
            <img className={`${style[`${gadget.type}Gadget`]}`}
                 src={`/assets/gadgets/${gadget.type}/${gadget.data}`}
                 alt={gadget.data} />}
        </div>
      ))}
    </div>
  );
}

function Editor({ editorVisible, setEditorVisible, type }: {
  editorVisible: boolean,
  setEditorVisible: (visible: boolean) => void
  type: GadgetType
}) {
  const [selectedDisplayType, setSelectedDisplayType] = useState<DisplayType>('color');
  const dataRef = useRef<HTMLInputElement>(null);

  function resetForm() {
    if (dataRef.current) {
      dataRef.current.value = '';
    }
    setSelectedDisplayType('color');

    setEditorVisible(false);
  }

  function saveGadget() {
    getApi().post('/gadgets', {
      type,
      displayType: selectedDisplayType,
      data: dataRef.current?.value,
    }).then(() => {
      resetForm();
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <FloatingContainer visible={editorVisible} setVisible={setEditorVisible}>
      <h1>Add new {type} gadget</h1>
      <label>Select display type</label>
      <ButtonSelector active={selectedDisplayType} setActive={setSelectedDisplayType}>
        <SelectButton id={'color'}>Color</SelectButton>
        <SelectButton id={'image'}>Image</SelectButton>
      </ButtonSelector>
      <label>
        Gadget data
      </label>
      <input type="text" ref={dataRef} />

      <InlineButtons>
        <Button onClick={saveGadget}>Save</Button>
        <Button type={'secondary'} onClick={resetForm}>Cancel</Button>
      </InlineButtons>
    </FloatingContainer>
  );
}