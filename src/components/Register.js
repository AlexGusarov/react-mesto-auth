import React from 'react';
import { withRouter } from 'react-router-dom';
import Welcome from './Welcome';


function Register({ handleChange, handleSubmit }) {
  return (
    <>
      <Welcome
        link="/sign-up"
        title="Регистрация"
        textButton="Зарегистрироваться"
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  )
}

export default withRouter(Register);
