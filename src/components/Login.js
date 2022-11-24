import React from "react";
import Welcome from "./Welcome";

function Login({ handleSubmit }) {

  return (
    <>
      <Welcome
        link="/sign-in"
        textLink="Регистрация"
        title="Войти"
        textButton="Войти"
        handleSubmit={handleSubmit}
      />
    </>
  )
}


export default Login;