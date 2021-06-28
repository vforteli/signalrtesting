import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import fooSlice from './store/messages/messagesSlice';
import signalrSlice from './store/messages/signalrSlice';
import authenticationSlice from './store/authentication/authenticationSlice';
import logger from 'redux-logger'
import { BrowserRouter } from 'react-router-dom';


const store = configureStore({
  reducer: {
    messages: fooSlice,
    foohub: signalrSlice,
    currentUser: authenticationSlice,
  },
  middleware: [logger, ...getDefaultMiddleware()],
})

// todo supposedly material ui picks the nonce from meta by itself
// const nonceRegex = /csp-nonce=(?<nonce>[^;]*)/
// const match = document.cookie.match(nonceRegex)
// const nonce = match && match.groups ? match.groups.nonce : ''

export type RootState = ReturnType<typeof store.getState>;

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Auth0Provider
          domain={process.env.REACT_APP_AUTH_DOMAIN ?? ''}
          clientId={process.env.REACT_APP_AUTH_CLIENT_ID ?? ''}
          redirectUri={window.location.origin}
          audience={process.env.REACT_APP_AUTH_AUDIENCE ?? ''}
          cacheLocation='localstorage'
          scope='openid profile email'
        >
          <App />
        </Auth0Provider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
