import React from "react";
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
import ProtectedRoute from "./ProtectedRoute";
import InfoToolTip from "./InfoTooltip";
import { register, authorize, getContent } from "./Auth";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = React.useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = React.useState(false);
  const [selectedCard, setSelectedCard] = React.useState({});
  const [currentUser, setCurrentUser] = React.useState({});
  const [cards, setCards] = React.useState([]);
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [isInfoToolTipOpen, setIsInfoToolTipOpen] = React.useState(false);
  const [infoToolTipStatus, setInfoToolTipStatus] = React.useState("");
  const hist = useHistory();
  const [userData, setUserData] = React.useState(
    {
      email: '',
      password: ''
    }
  )


  React.useEffect(() => {
    api.getInitialCards()
      .then((res) => setCards(res))
      .catch((err) => {
        console.log(`Произошла ошибка с получением данных карточек - ${err}`)
      })
  }, [])


  React.useEffect(() => {
    api.getUserInfo()
      .then((res) => {
        setCurrentUser(res);
      })
      .catch((err) => {
        console.log(`Произошла ошибка с получением данных о пользователе - ${err}`);
      })
  }, []);


  React.useEffect(() => {
    tokenCheck();
  }, [])


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


  function handleRegisterSubmit(evt) {
    evt.preventDefault();

    const { email, password } = userData;
    register(email, password)
      .then((res) => {
        if (res) {
          setIsInfoToolTipOpen(true);
          setInfoToolTipStatus('ok');
          hist.push('/sign-in');
        }
        else {
          setIsInfoToolTipOpen(true);
          setInfoToolTipStatus('Что-то пошло не так :(');
        }
      })
      .catch((err) => console.log(err))
  }


  function handleLogin(evt) {
    evt.preventDefault();
    setLoggedIn(true);
  }


  function handleLoginSubmit(evt) {
    evt.preventDefault();

    if (!userData.email || !userData.password) {
      return;
    }

    authorize(userData.email, userData.password)
      .then((data) => {
        if (data.token) {
          setUserData({ email: '', password: '' }, () => {
            handleLogin();
            hist.push('/');
          })
        }
      })
      .catch((err) => console.log(err));
  }


  function tokenCheck() {
    if (localStorage.getItem('token')) {
      const token = localStorage.getItem('token');
      if (token) {
        getContent(token).then((res) => {
          if (res) {
            setLoggedIn(true, () => {
              hist.push('/');
            })
          }
        })
      }
    }
  }


  function onSignOut() {
    localStorage.removeItem('token');
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
                    handleSubmit={handleRegisterSubmit}
                  />
                </Route>
                <Route path="/sign-in">
                  <Login
                    handleChange={handleInputWelcomeChange}
                    handleSubmit={handleLoginSubmit}
                  />
                </Route>
                <ProtectedRoute
                  exact path="/"
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
              <Route exact path="/">
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
