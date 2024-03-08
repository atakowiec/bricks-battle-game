import style from './Gadgets.module.scss';

export default function Gadgets() {
    return (
        <div className={style.container}>
            <h1>Personalize</h1>
            <div className={`row`}>
                <div className={`${style.gadgetBox}`}>
                    <div className={style.gadgetIcon}>
                        <img src="/assets/icon.png" alt="Profile Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        icon
                    </div>
                </div>
                <div className={`${style.gadgetBox}`}>
                    <div className={style.gadgetIcon}>
                        <img src="/assets/paddle.png" alt="Paddle Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        paddle
                    </div>
                </div>
                <div className={`${style.gadgetBox}`}>
                    <div className={style.gadgetIcon}>
                        <img src="/assets/ball.png" alt="Ball Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        ball
                    </div>
                </div>
                <div className={`${style.gadgetBox}`}>
                    <div className={style.gadgetIcon}>
                        <img src="/assets/trails.png" alt="Trails Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        trails
                    </div>
                </div>
                <div className={`${style.gadgetBox}`}>
                    <div className={style.gadgetIcon}>
                        <img src="/assets/barrier.png" alt="Trails Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        barrier
                    </div>
                </div>
                <div className={`${style.gadgetBox}`}>
                    <div className={`${style.gadgetIcon}`}>
                        <img src="/assets/effects.png" alt="Trails Icon"/>
                    </div>
                    <div className={style.gadgetName}>
                        effects
                    </div>
                </div>
            </div>
        </div>
    );
}