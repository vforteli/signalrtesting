import { useAuth0 } from '@auth0/auth0-react';
import { Container, CssBaseline } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Route, Switch } from 'react-router-dom';
import { OpenAPI } from './apiclient';
import PrivateRoute from './Components/Auth/PrivateRoute';
import Bar from './Components/Bar/Bar';
import Front from './Components/Front/Front';
import AppHeader from './Components/Header/Header';
import HubNotificationMessage from './Components/HubNotificationMessage';
import MessageContainer from './Components/Messages/MessageContainer';
import { MessagesContextProvider } from './Components/Messages/MessagesContext';
import { AppConfig } from './appConfig';
import { setCurrentUser } from './store/authentication/authenticationSlice';
import { getDefaultHeaders } from './Utils';



function App() {
  const dispatch = useDispatch()
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0()

  OpenAPI.BASE = AppConfig.REACT_APP_BACKEND_URL
  OpenAPI.TOKEN = getAccessTokenSilently
  OpenAPI.HEADERS = getDefaultHeaders

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(setCurrentUser({ isLoggedIn: isAuthenticated, user: user }))
    }
  }, [isAuthenticated, dispatch, user])

  return (
    <MessagesContextProvider>
      <CssBaseline />

      <HubNotificationMessage />

      <AppHeader />

      <Container sx={{ bgcolor: '#eeeeee' }}>
        <Switch>
          <Route path="/" exact component={Front} />
          <PrivateRoute path="/foo" component={MessageContainer} />
          <Route path="/bar" component={Bar} />
        </Switch>
      </Container>
    </MessagesContextProvider>
  );
}

export default App;
