import React from "react";
import { Link } from "react-router-dom";

function Welcome({ link, title, textButton, handleSubmit, handleChange, userData }) {

  return (
    <div className="welcome">
      <div className="welcome__container">
        <p className="welcome__title">{title}</p>
        <form className="welcome__form" onSubmit={handleSubmit}>
          <input
            className="welcome__input"
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            value={userData.email}
            onChange={handleChange}>
          </input>
          <input
            className="welcome__input"
            type="password"
            name="password"
            id="password"
            placeholder="Пароль"
            value={userData.password}
            onChange={handleChange}>
          </input>
          <button type="submit" className="welcome__button-submit button">{textButton}</button>
        </form>
        <Link to={link} className="welcome__link-to-signin button">Уже зарегистрированы? Войти</Link>
      </div>
    </div>
  )
}
export default Welcome;