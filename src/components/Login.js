import React from "react";
import Welcome from "./Welcome";

function Login({ onLogin, handleChange, userData }) {
  console.log('userData in Login', userData);
  const handleSubmit = (evt) => {
    evt.preventDefault();
    let { email, password } = userData;
    if (!email || !password) {
      return;
    }
    onLogin(email, password);
    evt.target.reset();
  }

  return (
    <>
      <Welcome
        textLink="Регистрация"
        title="Войти"
        textButton="Войти"
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        userData={userData}
      />
    </>
  )
}


export default Login;