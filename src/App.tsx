import React, { useEffect } from 'react';
import './App.css';
import Foo from './Components/Foo';
import { useAuth0 } from "@auth0/auth0-react";
import Layout, { Content } from 'antd/lib/layout/layout';
import { Message } from './Components/FooTypes';
import AppHeader from './Components/Header/Header';
import { useDispatch } from 'react-redux';
import { fetchPreviousMessages, messageDeleted, messageReceived, messagesCleared } from './store/messages/messagesSlice';
import { setHubConnectionState } from './store/messages/signalrSlice';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { setCurrentUser } from './store/authentication/authenticationSlice';
import { Affix } from 'antd';
import HubNotificationMessage from './Components/HubNotificationMessage';
import Bar from './Components/Bar/Bar';
import { Route, Switch } from 'react-router-dom';
import Front from './Components/Front/Front';
import PrivateRoute from './Components/Auth/PrivateRoute';


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, getAccessTokenSilently, user } = useAuth0();

  const connection: HubConnection = new HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl(process.env.REACT_APP_SIGNALR_HUB_URL ?? '', { accessTokenFactory: getAccessTokenSilently })
    .build();

  connection.on("broadcastMessage", (message: Message) => dispatch(messageReceived(message)));
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
        const token = await getAccessTokenSilently();
        dispatch(setCurrentUser({ accessToken: token, isLoggedIn: isAuthenticated, username: user?.name ?? '' }))
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
    <Layout className="layout" style={{ minHeight: "100vh" }}>
      <HubNotificationMessage />
      <Affix offsetTop={0}>
        <AppHeader />
      </Affix>
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Switch>
            <Route path="/" exact component={Front} />
            <PrivateRoute path="/foo" component={Foo} />
            <Route path="/bar" component={Bar} />
          </Switch>
        </div>
      </Content>
    </Layout>
  );
}

export default App;
