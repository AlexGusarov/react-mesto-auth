import React from "react";
import Welcome from "./Welcome";

function Login({ handleSubmit, handleChange }) {

  return (
    <>
      <Welcome
        textLink="Регистрация"
        title="Войти"
        textButton="Войти"
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  )
}


export default Login;