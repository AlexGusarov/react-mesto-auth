import React from 'react';
import { withRouter } from 'react-router-dom';
import Welcome from './Welcome';


function Register({ handleSubmit }) {
  return (
    <>
      <Welcome
        link="/sign-in"
        textLink="Войти"
        title="Регистрация"
        textButton="Зарегистрироваться"
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default withRouter(Register);
