const BASE_URL = 'https://auth.nomoreparties.co';

export const register = (email, password) => {
  console.log(email, password, 'in auth')
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then(checkResponse)
};

export const authorize = (id, password) => {
  console.log(id, password, 'in auth')
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, password })
  })
    .then(checkResponse)
}

export const checkToken = (token) => {
  fetch(`${BASE_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(checkResponse)
}

const checkResponse = (res) => {
  res.ok ? res.json() : Promise.reject(`Ошибка: ${res.statusText}`);
}