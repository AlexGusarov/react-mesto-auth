import React from "react";
import { Route, Link } from "react-router-dom";
import logo from "../images/logo.svg"

function Header({ email, onSignOut }) {
  return (
    <header className="header">
      <img src={logo} alt="Место" className="header__logo" />
      <Route exact path="/sign-up">
        <Link to="/sign-in" className="header__link">Войти</Link>
      </Route>
      <Route exact path="/sign-in">
        <Link to="/sign-up" className="header__link">Регистрация</Link>
      </Route>
      <Route exact path="/">
        <div className="header__userinfo">
          <p className="header__login">`${email}`</p>
          <Link
            to="/sign-in"
            className="header__link"
            onClick={onSignOut}>
            Выйти
          </Link>
        </div>
      </Route>

    </header>
  )
}

export default Header;