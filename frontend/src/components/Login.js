import React from "react";

function Login({onLogin}) {
    const [login, setLogin] = React.useState({});

    const handleChange = (event) => {
        const { value, name } = event.target;
        setLogin({ ...login, [name]: value });
    };

    function handleSubmit(e) {
        e.preventDefault();
        onLogin(login.password, login.email);
    }

    return(
            <div className="login">
                <h2 className="login__heading">Вход</h2>
                <form className="form form_theme_dark" onSubmit={handleSubmit}>
                    <input
                        required
                        className="form__text form__text_theme_dark"
                        placeholder="Email"
                        id="email"
                        name="email"
                        type="e-mail"
                        value={login.email || ''}
                        onChange={handleChange}
                    />
                    <input
                        required
                        className="form__text form__text_theme_dark"
                        placeholder="Пароль"
                        id="password"
                        name="password"
                        type="password"
                        value={login.password || ''}
                        onChange={handleChange}
                    />
                    <button
                        type="submit"
                        className="form__submit-btn form__submit-btn_theme_dark"
                    >
                        Войти
                    </button>
                </form>
            </div>
    )
}

export default Login;