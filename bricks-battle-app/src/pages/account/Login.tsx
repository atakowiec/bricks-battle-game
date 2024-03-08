import style from './Account.module.scss';

export function Login() {
    return (
        <div className={style.container}>
            <h1>Login</h1>
            <input type={'text'} placeholder={'Username'}/>
            <br/>
            <input type={'password'} placeholder={'Password'}/>
            <br/>
            <div className={style.buttonsBox}>
                <button>Login</button>
                <button>Register</button>
            </div>
        </div>
    )
}