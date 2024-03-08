import style from './MainMenu.module.scss';
import title from '../../util/title.ts';

export default function MainMenu() {
    title('Main Menu')

    return (
        <div className={style.container}>
            <h1>BRICKS BATTLE</h1>
            <button>Create game</button>
            <div className={style.separator}>
                or
            </div>
            <input type={'text'} placeholder={'Enter game code'}/>
            <br/>
            <button>Join game</button>
        </div>
    )
}