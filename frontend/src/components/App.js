import React, {useState} from 'react';
import {Redirect, Route, Switch, useHistory} from 'react-router-dom';
import Header from './Header';
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import Footer from "./Footer";
import ImagePopup from "./ImagePopup";
import EditProfilePopup from "./EditProfilePopup";
import { api } from "../utils/api";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from "../utils/auth";
import toolTipIconSuc from '../images/successfuly.svg';
import toolTipIconUnsuc from '../images/unsuccessfuly.svg';
import InfoTooltip from "./InfoTooltip";

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState("");
    const [tooltipMessage, setTooltipMessage] = useState('');
    const [messageIcon, setMessageIcon] = useState('');
    const [isInfoTooltipOpen, setIsInfoTooltipOpen] = useState(false);

    const history = useHistory();

    const handleRegister = (password, email) => {
        auth.register({ password, email })
            .then(() => {
                setIsInfoTooltipOpen(true);
                setTooltipMessage('Вы успешно зарегистрировались!');
                setMessageIcon(toolTipIconSuc);
            })
            .then(() => {
                history.push("/sign-in");
            })
            .catch(err => {
                setIsInfoTooltipOpen(true);
                setTooltipMessage('Что-то пошло не так!\n' +
                    'Попробуйте ещё раз.');
                setMessageIcon(toolTipIconUnsuc);
                console.log(err);
            })
    }

    const handleLogin = (password, email) => {
        auth.authorize(password, email)
            .then(() => {
                setLoggedIn(true);
                setUserData(email);
            })
            .then(() => {
                history.push("/");
            })
            .catch((err) => {
                setIsInfoTooltipOpen(true);
                setTooltipMessage('Что-то пошло не так!\n' +
                    'Попробуйте ещё раз.');
                setMessageIcon(toolTipIconUnsuc);
                console.log(err);
            })
    }

    React.useEffect(() => {
        checkToken()
    }, []);

    const checkToken = () => {
      const jwt = localStorage.getItem('jwt');

      if (jwt) {
          auth.checkToken(jwt)
              .then((response) => {
                  setUserData(response.data.email);
                  setLoggedIn(true);
                  history.push('/');
              })
              .catch((err) => {
                  console.log(err);
              })
      }
    }
    
    const handleSignOut = () => {
      localStorage.removeItem('jwt');
      setLoggedIn(false);
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    const handleEditProfileClick = () => {
        setIsEditProfilePopupOpen(true);
    }

    const handleAddPlaceClick = () => {
        setIsAddPlacePopupOpen(true);
    }

    const closeAllPopups = () => {
        setIsEditAvatarPopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsAddPlacePopupOpen(false);
        setSelectedCard({});
        setIsInfoTooltipOpen(false);
        setTooltipMessage('');
        setMessageIcon('');
    }

    const handleCardClick = (card) => {
        setSelectedCard(card);
    }

    React.useEffect(() => {
        api.getProfile()
            .then((profile) => {
                console.log(profile);
                setCurrentUser(profile);
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
        api.getInitialData()
            .then((initialCards) => {
                //отрисовка карточек
                setCards(initialCards);
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    },[loggedIn]);

    function handleUpdateUser({name, about}) {
        api.editProfile({name, about})
            .then((newUser) => {
                setCurrentUser(newUser);
                closeAllPopups();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    }

    function handleUpdateAvatar(avatar) {
        console.log(avatar);
        api.editAvatar(avatar)
            .then((newUser) => {
                console.log(newUser)
                setCurrentUser(newUser);
                closeAllPopups();
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    }
    
    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        // Отправляем запрос в API и получаем обновлённые данные карточки
        api.changeLikeCardStatus(card._id, !isLiked)
            .then((newCard) => {
                setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then((result) => {
                setCards((state) => state.filter((c) => c._id !== card._id));
            })
            .catch((err) => {
                console.error(err);
                throw err;
            });
    }

    function handleAddPlaceSubmit({ name, link, owner }) {
        api.createNewCard({ name, link, owner })
            .then((newCard) => {
                setCards([newCard, ...cards]);
                closeAllPopups();
            })
            .catch((err) => {
            console.error(err);
            throw err;
        });
    }

        return (
            <CurrentUserContext.Provider value={currentUser}>
                <div className="page">
                    <Header data={userData} loggedIn={loggedIn} onSignOut={handleSignOut}/>
                    <Switch>
                        <ProtectedRoute exact path="/" isLoggedIn={loggedIn}>
                            <Main
                                onEditProfile={handleEditProfileClick}
                                onAddPlace={handleAddPlaceClick}
                                onEditAvatar={handleEditAvatarClick}
                                onCardClick={handleCardClick}
                                cards={cards}
                                onCardLike={handleCardLike}
                                onCardDelete={handleCardDelete}
                            />
                        </ProtectedRoute>
                        <Route path='/sign-in'>
                            <Login onLogin={handleLogin} />
                        </Route>
                        <Route path='/sign-up'>
                            <Register onRegister={handleRegister} />
                        </Route>
                        <Route path="*">
                            <Redirect to={'/sign-in'} />
                        </Route>
                    </Switch>

                    <Footer/>

                    <InfoTooltip
                        isOpen={isInfoTooltipOpen}
                        messageIcon={messageIcon}
                        tooltipMessage={tooltipMessage}
                        onClose={closeAllPopups}
                    />

                    <EditProfilePopup
                        isOpen={isEditProfilePopupOpen}
                        onClose={closeAllPopups}
                        onUpdateUser={handleUpdateUser}

                    />

                    <AddPlacePopup
                        isOpen={isAddPlacePopupOpen}
                        onClose={closeAllPopups}
                        onAddPlace={handleAddPlaceSubmit}
                    />

                    <EditAvatarPopup
                        isOpen={isEditAvatarPopupOpen}
                        onClose={closeAllPopups}
                        onUpdateAvatar={handleUpdateAvatar}
                    />

                    <ImagePopup
                        card={selectedCard}
                        onClose={closeAllPopups}
                    />

                    <div className="popup popup_type_delete-card">
                        <div className="popup__container">
                            <h2 className="popup__title popup__title_type_delete-window">Вы уверены?</h2>
                            <button className="popup__close-btn" type="button" aria-label="Закрыть"/>
                            <form className="form" name="delete-card">
                                <button type="submit" className="form__submit-btn">Да</button>
                            </form>
                        </div>
                    </div>

                </div>
            </CurrentUserContext.Provider>
        );
}

export default App;