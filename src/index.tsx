import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import fooSlice from './store/messages/messagesSlice';
import signalrSlice from './store/messages/signalrSlice';
import authenticationSlice from './store/authentication/authenticationSlice';


const store = configureStore({
  reducer: {
    messages: fooSlice,
    foohub: signalrSlice,
    currentUser: authenticationSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Auth0Provider
        domain={process.env.REACT_APP_AUTH_DOMAIN ?? ''}
        clientId={process.env.REACT_APP_AUTH_CLIENT_ID ?? ''}
        redirectUri={window.location.origin}
        audience={process.env.REACT_APP_AUTH_AUDIENCE ?? ''}
        cacheLocation='localstorage'
        scope='openid%20profile%20email'    >
        <App />
      </Auth0Provider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
