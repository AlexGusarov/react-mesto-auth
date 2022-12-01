import { useCallback, useState, useEffect } from "react";
import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import EditProfilePopup from "./EditProfilePopup";
import ImagePopup from "./ImagePopup";
import api from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext.js";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import Register from "./Register";
import { BrowserRouter, Switch, Route, Redirect, useHistory } from "react-router-dom";
import Login from "./Login";
import { ProtectedRoute } from "./ProtectedRoute";
import InfoToolTip from "./InfoTooltip";
import * as auth from "../utils/auth";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [cards, setCards] = useState([]);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = useState(false);
  const [infoToolTipStatus, setInfoToolTipStatus] = useState("");
  const hist = useHistory();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(
    {
      email: '',
      password: ''
    }
  )
  let token = localStorage.getItem('token');


  function handleInputWelcomeChange(e) {
    const { name, value } = e.target;
    setUserData(
      {
        ...userData,
        [name]: value
      })
  }


  function handleCardLike(card) {
    const isLiked = card.likes.some(i => i._id === currentUser._id);
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => { console.log(`Не получилось поставить лайк - ${err}`) });
  }


  function handleCardDelete(card) {
    api.deleteCard(card._id)
      .then((res) => {
        if (res) {
          setCards(cards.filter((item) => item._id !== card._id));
        }
      })
      .catch((err) => console.log(`Карта не удалилась - ${err}`));
  }


  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }


  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }


  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }


  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard({});
  }


  function handleCardClick(selectedCard) {
    setSelectedCard(selectedCard);
  }


  function handleUpdateUser(data) {
    api.editProfile(data)
      .then((res) => {
        setCurrentUser(res)
      })
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Не удалось обновить данные пользователя — ${err}`));
  }


  function handleUpdateAvatar(data) {
    api.editAvatar(data)
      .then((res) => setCurrentUser(res))
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Не удалось обновить аватар - ${err}`));
  }


  function handleAddPlaceSubmit({ name, link }) {
    api.getNewCard({ name, link })
      .then((newCard) => setCards([newCard, ...cards]))
      .then(() => closeAllPopups())
      .catch((err) => console.log(`Не удалось загрузить новую карточку - ${err}`));
  }


  function onSignOut() {
    localStorage.removeItem('token');
  }

  const tokenCheck = useCallback(async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error('Нет токена')
      }

      const userInfo = await auth.checkToken(token);
      if (!userInfo) {
        throw new Error('Нет юзера');
      }

      if (userInfo) {
        setLoggedIn(true);
      }
    } catch (err) { console.log(err) }
    finally { setLoading(false) }
  }, []);

  const cbAuthenticate = useCallback((data) => {
    localStorage.setItem('token', data.token);
    setLoggedIn(true);
  }, []);

  const cbRegister = useCallback(async (email, password) => {
    try {
      setLoading(true);
      console.log(email, password, 'cbRegister')
      const data = await auth.register(email, password);
      console.log(data);
      cbAuthenticate(data);
      return data;
    } catch (err) { console.log(err) }
    finally {
      setLoading(false);
    }
  }, []);

  const cbLogin = useCallback(async (login, password) => {
    try {
      setLoading(true);
      const data = await auth.authorize(login, password);
      if (!data) {
        throw new Error('Неверные логин или пароль')
      }
      if (data.token) {
        setLoggedIn(true);
        localStorage.setItem('token', data.token);
      }
    } catch (err) { console.log(err) }
    finally {
      setLoading(false)
    }

  }, []);


  useEffect(() => {
    if (token) {
      api.getInitialCards()
        .then((res) => setCards(res))
        .catch((err) => {
          console.log(`Произошла ошибка с получением данных карточек - ${err}`)
        })
    }
  }, [loggedIn])


  useEffect(() => {
    if (token) {
      api.getUserInfo()
        .then((res) => {
          setCurrentUser(res);
        })
        .catch((err) => {
          console.log(`Произошла ошибка с получением данных о пользователе - ${err}`);
        })
    }
  }, [loggedIn]);


  useEffect(() => {
    tokenCheck();
  }, [tokenCheck, loggedIn])


  if (loading) {
    return '...Загрузка'
  }


  return (
    <BrowserRouter>
      <CurrentUserContext.Provider value={currentUser}>
        <div className="App">
          <div className="root">
            <div className="page text-smoothing">
              <Header onSignout={onSignOut} />
              <Switch>
                <Route path="/sign-up">
                  <Register
                    userData={userData}
                    handleChange={handleInputWelcomeChange}
                    onRegister={cbRegister}
                  />
                </Route>
                <Route path="/sign-in">
                  <Login
                    handleChange={handleInputWelcomeChange}
                    onLogin={cbLogin}
                    userData={userData}
                  />
                </Route>
                <ProtectedRoute
                  exact path="/"
                  loggedIn={loggedIn}
                  component={
                    <Main
                      onEditAvatar={handleEditAvatarClick}
                      onEditProfile={handleEditProfileClick}
                      onAddPlace={handleAddPlaceClick}
                      onCardClick={handleCardClick}
                      cards={cards}
                      onCardLike={handleCardLike}
                      onCardDelete={handleCardDelete}
                      loggedIn={loggedIn}
                    />}
                />
              </Switch>
              <Footer />
              <Route path="*">
                {console.log("Redirect loggenIn", loggedIn)}
                {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
              </Route>
              <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
              <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />
              <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />
              <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
              />
              <InfoToolTip
                onClose={closeAllPopups}
                isOpen={isInfoToolTipOpen}
                status={infoToolTipStatus}
              />
            </div>
          </div>
        </div>
      </CurrentUserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
