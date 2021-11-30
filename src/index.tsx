import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Auth0Provider } from '@auth0/auth0-react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux'
import messagesSlice from './store/messages/messagesSlice';
import signalrSlice from './store/messages/signalrSlice';
import authenticationSlice from './store/authentication/authenticationSlice';
import logger from 'redux-logger'
import { BrowserRouter } from 'react-router-dom';
import appSlice from './store/app/appSlice';
import { createTheme, ThemeProvider } from '@mui/material';
import { getNonceFromCookie } from './Utils';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';


const store = configureStore({
  reducer: {
    messages: messagesSlice,
    signalr: signalrSlice,
    currentUser: authenticationSlice,
    app: appSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger)
})

const cache = createCache({
  key: 'app',
  nonce: getNonceFromCookie(),
  prepend: true,
});

const theme = createTheme();

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
          <CacheProvider value={cache}>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </CacheProvider>
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
