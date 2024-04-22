import { StateProps } from './MapEditor.tsx';
import style from '../MapHub.module.scss';
import { useState } from 'react';
import FloatingContainer, { FloatingContainerProps } from '../../../components/FloatingContainer.tsx';
import Button from '../../../components/Button.tsx';
import { layoutActions } from '../../../store/layoutSlice.ts';
import { useDispatch } from 'react-redux';
import { InlineButtons } from '../../../components/InlineButtons.tsx';

export function BottomButtons(props: StateProps & { saveMap: () => void }) {
  const [exitConfirmationVisible, setExitConfirmationVisible] = useState(false);
  const [saveConfirmationVisible, setSaveConfirmationVisible] = useState(false);

  return (
    <>
      <div className={style.bottomButtons}>
        <button onClick={() => setSaveConfirmationVisible(true)}>
          Save
        </button>
        <button onClick={() => setExitConfirmationVisible(true)}>
          Exit
        </button>
      </div>

      <ExitConfirmation visible={exitConfirmationVisible}
                        setVisible={setExitConfirmationVisible} />

      <SaveConfirmation visible={saveConfirmationVisible}
                        setVisible={setSaveConfirmationVisible}
                        saveMap={props.saveMap} />
    </>
  );
}

function ExitConfirmation(props: FloatingContainerProps) {
  const dispatch = useDispatch();

  return (
    <FloatingContainer {...props}>
      <h1>Exit confirmation</h1>
      <p>
        Are you sure you want to exit? All unsaved changes will be lost.
      </p>
      <InlineButtons className={"mx-5"}>
        <Button type={'primary'} onClick={() => dispatch(layoutActions.setTab('map-hub'))}>
          Exit
        </Button>
        <Button type={'secondary'} onClick={() => props.setVisible(false)}>
          Cancel
        </Button>
      </InlineButtons>
    </FloatingContainer>
  );
}

function SaveConfirmation(props: FloatingContainerProps & { saveMap: () => void }) {
  return (
    <FloatingContainer {...props}>
      <h1>Save confirmation</h1>
      <p>
        Are you sure you want to save? You will not be able to edit this map later (yet).
      </p>
      <div className={`${style.bottomButtons} mt-5`}>
        <Button type={'primary'} onClick={props.saveMap}>
          Save
        </Button>
        <Button type={'secondary'} onClick={() => props.setVisible(false)}>
          Cancel
        </Button>
      </div>
    </FloatingContainer>
  );
}