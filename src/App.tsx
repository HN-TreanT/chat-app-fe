import React, { useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "react-notifications-component/dist/theme.css";
import { store, persistor } from "./redux";
import { Navigate, Route, Routes } from "react-router-dom";
import RouterLinks from "./const/router_link";
import { ReactNotifications } from "react-notifications-component";
import LoginPage from "./page/login-page/loginPage";
import RegisterPage from "./page/register-page/registerPage";
import HomePage from "./page/home-page/HomePage";
import { AuthorizationComponent } from "./components/authorization/AuthorizationComponent";
import { socket, AppContext } from "./context/appContext";
import Room from "./page/home-page/chat-container/RoomVideoCall/Room";
import LoginGGFB from "./page/login-gg-fb/LoginGGFB";
function App() {
  const [messages, setMessages] = useState([]);
  return (
    <>
      <ReactNotifications />

      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppContext.Provider value={{ socket, messages, setMessages }}>
            <div className="MainApp">
              <div className="MainContent">
                <div className="ContentPage">
                  <Routes>
                    <Route path="/" element={<Navigate to={RouterLinks.LOGIN_PAGE} />} />
                    <Route path={RouterLinks.LOGIN_PAGE} element={<LoginPage />} />

                    <Route path={RouterLinks.REGISTER_PAGE} element={<RegisterPage />} />

                    <Route
                      path={RouterLinks.HOME_PAGE}
                      element={<AuthorizationComponent element={<HomePage />} />}
                    />
                    <Route path="/video-call/:roomId" element={<Room />} />
                    <Route path={RouterLinks.LOGIN_GG} element={<LoginGGFB />} />
                  </Routes>
                </div>
              </div>
            </div>
          </AppContext.Provider>
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
