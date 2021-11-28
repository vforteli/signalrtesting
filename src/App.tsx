import { useEffect } from 'react';
import MessageContainer from './Components/Messages/MessageContainer';
import { useAuth0 } from "@auth0/auth0-react";
import AppHeader from './Components/Header/Header';
import { useDispatch } from 'react-redux';
import { fetchPreviousMessages, messageDeleted, messageReceived, messagesCleared } from './store/messages/messagesSlice';
import { setHubConnectionState } from './store/messages/signalrSlice';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { setCurrentUser } from './store/authentication/authenticationSlice';
import HubNotificationMessage from './Components/HubNotificationMessage';
import Bar from './Components/Bar/Bar';
import { Route } from 'react-router-dom';
import Front from './Components/Front/Front';
import PrivateRoute from './Components/Auth/PrivateRoute';
import { Container, CssBaseline } from '@material-ui/core';
import { MessageModel, OpenAPI } from './apiclient';
import { getCsrfTokenFromCookie, getDefaultHeaders } from './Utils';
import { Switch } from 'react-router-dom';


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const connection: HubConnection = new HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently, headers: { 'X-XSRF-TOKEN': getCsrfTokenFromCookie() } })
    .build();

  connection.on("broadcastMessage", (message: MessageModel) => dispatch(messageReceived(message)));
  connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
  connection.on("clearMessages", () => dispatch(messagesCleared()));
  connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
  connection.onreconnected(() => {
    dispatch(setHubConnectionState(connection.state));
    dispatch(fetchPreviousMessages());
  });

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        OpenAPI.BASE = process.env.REACT_APP_BACKEND_URL ?? ''
        OpenAPI.TOKEN = getAccessTokenSilently
        OpenAPI.HEADERS = getDefaultHeaders
        dispatch(setCurrentUser({ isLoggedIn: isAuthenticated, username: user?.name ?? '', user: user }))
      })();

      dispatch(setHubConnectionState(HubConnectionState.Connecting));
      connection.start().then(() => dispatch(setHubConnectionState(connection.state))).catch(err => console.error(err));

      return () => {
        if (connection && connection.state !== HubConnectionState.Disconnected) {
          connection.stop();
        }
      }
    }
  }, [connection, isAuthenticated, getAccessTokenSilently, dispatch, user])

  return (
    <>
      <CssBaseline />

      <HubNotificationMessage />

      <AppHeader />

      <Container>
        <Switch>
          <Route path="/" exact component={Front} />
          <PrivateRoute path="/foo" component={MessageContainer} />
          <Route path="/bar" component={Bar} />
        </Switch>
      </Container>
    </>
  );
}

export default App;
