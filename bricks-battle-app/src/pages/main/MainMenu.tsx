import style from './MainMenu.module.scss';

export default function MainMenu() {
  return (
    <div className={style.container}>
      <h1>BRICKS BATTLE</h1>
      <button>Create game</button>
      <div className={style.separator}>
        or
      </div>
      <input type={'text'} placeholder={'Enter game code'} />
      <br />
      <button>Join game</button>
    </div>
  )
}