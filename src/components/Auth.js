export const BASE_URL = 'https://auth.nomoreparties.co/';

export const register = (email, password) => {
  return fetch(`${BASE_URL}/signup`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  })
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      }
    })
    .then((res) => {
      return res;
    })
    .catch((err) => console.log(err))
};

export const authorize = ({ id, password }) => {
  return fetch(`${BASE_URL}/signin`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ id, password })
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem('token', data.token);
        return data;
      }
    })
    .catch((err) => console.log(err))
}

export const getContent = (token) => {
  fetch(`${BASE_URL}/users/mыe`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(res => res.json())
    .then(data => data)
    .catch(err => console.log(err));
}