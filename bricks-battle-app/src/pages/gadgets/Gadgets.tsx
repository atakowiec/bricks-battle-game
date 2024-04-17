import style from './Gadgets.module.scss';
import title from '../../utils/title.ts';
import { useState } from 'react';
import { GadgetsSelector } from './GadgetsSelector.tsx';
import { GadgetType } from '@shared/Gadgets.ts';
import useSelector from '../../hooks/useSelector.ts';

export default function Gadgets() {
  title('Personalize');
  const [selectedCategory, setSelectedCategory] = useState<GadgetType | null>(null);
  const user = useSelector(state => state.user);

  if (selectedCategory)
    return <GadgetsSelector type={selectedCategory} back={setCategory(null)} />;

  function setCategory(category: GadgetType | null) {
    return () => setSelectedCategory(category);
  }

  return (
    <div className={style.container}>
      <h1>Personalize</h1>
      {!user.loggedIn && <p className={'text-center'}>
        You must be logged in to use gadgets.
      </p>}
      <div className={`row`}>
        <div className={`${style.gadgetBox}`} onClick={setCategory('icon')}>
          <div className={style.gadgetIcon}>
            <img src="/assets/icon.png" alt="Profile Icon" />
          </div>
          <div className={style.gadgetName}>
            icon
          </div>
        </div>
        <div className={`${style.gadgetBox}`} onClick={setCategory('paddle')}>
          <div className={style.gadgetIcon}>
            <img src="/assets/paddle.png" alt="Paddle Icon" />
          </div>
          <div className={style.gadgetName}>
            paddle
          </div>
        </div>
        <div className={`${style.gadgetBox}`} onClick={setCategory('ball')}>
          <div className={style.gadgetIcon}>
            <img src="/assets/ball.png" alt="Ball Icon" />
          </div>
          <div className={style.gadgetName}>
            ball
          </div>
        </div>
        <div className={`${style.gadgetBox}`} onClick={setCategory('trails')}>
          <div className={style.gadgetIcon}>
            <img src="/assets/trails.png" alt="Trails Icon" />
          </div>
          <div className={style.gadgetName}>
            trails
          </div>
        </div>
        {/*<div className={`${style.gadgetBox}`} onClick={setCategory("barrier")}>*/}
        {/*    <div className={style.gadgetIcon}>*/}
        {/*        <img src="/assets/barrier.png" alt="Barrier Icon"/>*/}
        {/*    </div>*/}
        {/*    <div className={style.gadgetName}>*/}
        {/*        barrier*/}
        {/*    </div>*/}
        {/*</div>*/}
        {/*<div className={`${style.gadgetBox}`} onClick={setCategory("effects")}>*/}
        {/*    <div className={`${style.gadgetIcon}`}>*/}
        {/*        <img src="/assets/effects.png" alt="Effects Icon"/>*/}
        {/*    </div>*/}
        {/*    <div className={style.gadgetName}>*/}
        {/*        effects*/}
        {/*    </div>*/}
        {/*</div>*/}
      </div>
    </div>
  );
}