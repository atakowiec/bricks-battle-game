import { DisplayType, GadgetType, IGadget } from '@shared/Gadgets.ts';
import style from './Gadgets.module.scss';
import Button from '../../components/Button.tsx';
import useApi from '../../hooks/useApi.ts';
import { InlineButtons } from '../../components/InlineButtons.tsx';
import { useRef, useState } from 'react';
import FloatingContainer from '../../components/FloatingContainer.tsx';
import { ButtonSelector, SelectButton } from '../../components/button-selector/ButtonSelector.tsx';
import getApi from '../../api/axios.ts';
import useSelector from '../../hooks/useSelector.ts';
import useNotifications from '../../hooks/useNotifications.ts';
import { useReloadApi } from '../../hooks/reload-api/useReloadApi.ts';
import { useDispatch } from 'react-redux';
import { gadgetsActions } from '../../store/gadgetsSlice.ts';

interface GadgetsSelectorProps {
  type: GadgetType;
  back: () => void;
}

export function GadgetsSelector(props: GadgetsSelectorProps) {
  const { data, loaded } = useApi<IGadget[]>(`/gadgets/all/${props.type}`, 'get');
  const [editorVisible, setEditorVisible] = useState(false);
  const [deleteActive, setDeleteActive] = useState(false);
  const user = useSelector(state => state.user);

  return (
    <>
      <Editor editorVisible={editorVisible} setEditorVisible={setEditorVisible} type={props.type} />
      <div className={`${style.container} text-center`}>
        <h1>{props.type}</h1>
        <InlineButtons className={'mb-4'}>
          <Button onClick={props.back} width={'auto'} className={'px-5'}>Back</Button>
          {user.admin &&
            <>
              <Button type={'secondary'} width={'auto'} className={'px-4'}
                      onClick={() => setEditorVisible(true)}>Add</Button>
              <Button type={deleteActive ? 'primary' : 'secondary'} width={'auto'} className={'px-4'}
                      onClick={() => setDeleteActive(prev => !prev)}>Delete</Button>
            </>
          }
        </InlineButtons>
        {loaded && !data?.length && <h5>No items available</h5>}
        {!!data?.length && <GadgetsList deleteActive={deleteActive} gadgets={data} />}
      </div>
    </>
  );
}

function GadgetsList(props: { gadgets: IGadget[], deleteActive: boolean }) {
  const [deleteScreenVisible, setDeleteScreenVisible] = useState(false);
  const gadgetToDelete = useRef<IGadget | null>(null);
  const reloadApi = useReloadApi();
  const dispatch = useDispatch();

  function onGadgetClick(gadget: IGadget) {
    if (props.deleteActive) {
      if (deleteScreenVisible) {
        getApi().delete(`/gadgets/${gadget._id}`).catch(err => {
          console.error(err);
        });
      } else {
        gadgetToDelete.current = gadget;
        setDeleteScreenVisible(true);
      }
    } else {
      // select gadget
      getApi().get(`/gadgets/select/${gadget._id}`).then((data) => {
        dispatch(gadgetsActions.selectGadget(data.data));
      }).catch(err => {
        console.error(err);
      });
    }
  }

  function resetDeleteScreen() {
    setDeleteScreenVisible(false);
    gadgetToDelete.current = null;
  }

  function deleteGadget() {
    if (!gadgetToDelete.current?._id) return;

    getApi().delete(`/gadgets/${gadgetToDelete.current?._id}`).then(() => {
      reloadApi();
      resetDeleteScreen();
    }).catch(err => {
      console.error(err);
    });
  }

  return (
    <>
      <div className={style.gadgetsList}>
        <FloatingContainer visible={deleteScreenVisible} setVisible={setDeleteScreenVisible}>
          <h1>
            Delete {gadgetToDelete.current?.type} gadget?
          </h1>
          <div className={'d-flex justify-content-center'}>
            {gadgetToDelete.current && <GadgetElement gadget={gadgetToDelete.current} deleteActive={false} />}
          </div>
          <InlineButtons>
            <Button type={'primary'} onClick={deleteGadget}>
              Delete
            </Button>
            <Button type={'secondary'} onClick={resetDeleteScreen}>
              Cancel
            </Button>
          </InlineButtons>
        </FloatingContainer>
        {props.gadgets.map(gadget => <GadgetElement gadget={gadget}
                                                    deleteActive={props.deleteActive}
                                                    onGadgetClick={onGadgetClick}
                                                    key={gadget._id} />)}
      </div>
    </>
  );
}

function GadgetElement({ gadget, deleteActive, onGadgetClick }: {
  gadget: IGadget,
  deleteActive?: boolean,
  onGadgetClick?: (gadget: IGadget) => void
}) {
  const selectedGadgets = useSelector(state => state.gadgets);

  return (
    <div className={`${style.gadget} ${selectedGadgets[gadget.type]?._id === gadget._id ? style.selected : ''}`}
         key={gadget._id}
         onClick={() => onGadgetClick?.(gadget)}>
      {gadget.type === 'trails' ?
        <TrailsGadgetElement gadget={gadget} /> :
        gadget.displayType === 'color' ?
          <div className={`${style[`${gadget.type}Gadget`]}`}
               style={{ backgroundColor: gadget.data }}>
          </div> :
          <div className={`${style[`${gadget.type}Gadget`]}`}
               style={{ backgroundImage: `url('/assets/gadgets/${gadget.type}/${gadget.data}')` }}>
          </div>}
      {deleteActive &&
        <div className={style.deleteIcon}>
          <img src={'/assets/trash-can.png'} alt={'trash can'} />
        </div>}
    </div>
  );
}

function TrailsGadgetElement(props: { gadget: IGadget }) {
  const ballStyles = props.gadget.data.split(';');
  while (ballStyles.length < 3) {
    ballStyles.push(ballStyles[ballStyles.length - 1]);
  }

  return (
    <div className={style.trailsGadget}>
      {ballStyles.map((ballStyle, i) => (
        props.gadget.displayType === 'color' ?
          <div key={i} className={style.trailBall} style={{ backgroundColor: ballStyle }} /> :
          <img key={i} className={style.trailBall} src={`/assets/gadgets/trails/${ballStyle}`} alt={ballStyle} />
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
  const { addNotification } = useNotifications();
  const reloadApi = useReloadApi();

  function resetForm() {
    if (dataRef.current) {
      dataRef.current.value = '';
    }
    setSelectedDisplayType('color');
    setEditorVisible(false);
    reloadApi();
  }

  function saveGadget() {
    getApi().post('/gadgets', {
      type,
      displayType: selectedDisplayType,
      data: dataRef.current?.value,
    }).then(() => {
      resetForm();
    }).catch(err => {
      addNotification(err.response?.data?.message, 'error');
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
        <Button onClick={saveGadget} width={'auto'} className={'px-4'}>Save</Button>
        <Button type={'secondary'} onClick={resetForm} width={'auto'} className={'px-4'}>Cancel</Button>
      </InlineButtons>
    </FloatingContainer>
  );
}