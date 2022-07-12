import React from "react";
import { Link } from 'react-router-dom';

function Register({onRegister}) {
    const [login, setLogin] = React.useState({ email: "", password: "" });

    const handleChange = (event) => {
        const { value, name } = event.target;
        setLogin({ ...login, [name]: value });
    };

    function handleSubmit(e) {
        e.preventDefault();
        const { password, email } = login;
        if (onRegister && password && email) {
            onRegister(password, email);
        }
    }

    return(
        <div className='login'>
            <h2 className='login__heading'>Регистрация</h2>
            <form onSubmit={handleSubmit} className="form form_theme_dark">
                <input
                    required
                    className="form__text form__text_theme_dark"
                    placeholder="Email"
                    id="email"
                    name="email"
                    type="e-mail"
                    value={login.email}
                    onChange={handleChange}
                />
                <input
                    required
                    className="form__text form__text_theme_dark"
                    placeholder="Пароль"
                    id="password"
                    name="password"
                    type="password"
                    value={login.password}
                    onChange={handleChange}
                />
                <button
                    type="submit"
                    className="form__submit-btn form__submit-btn_theme_dark"
                >
                    Зарегистрироваться
                </button>
            </form>
            <div className="login__signin">
                <p className="login__text">Уже зарегистрированы? </p>
                <Link to="/sign-in" className="login__link">Войти</Link>
            </div>
        </div>
    )
}

export default Register;