import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Welcome from './Welcome';


function Register({ handleChange, onRegister, userData, loggedIn }) {

  const handleSubmit = (evt) => {
    evt.preventDefault();
    console.log(userData)
    let { email, password } = userData;
    if (!email || !password) {
      return;
    }
    console.log(email, password, 'handleSubmit in Register')
    onRegister(email, password);
  }



  return (
    <>
      <Welcome
        title="Регистрация"
        textButton="Зарегистрироваться"
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        userData={userData}
      />
      <Link to="/sign-in" className="welcome__link-to-signin button">Уже зарегистрированы? Войти</Link>
      {loggedIn && <Redirect to="/sign-in" />}
    </>
  )
}

export default Register;
