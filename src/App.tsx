import React, { useEffect } from 'react';
import './App.css';
import Foo from './Components/Foo';
import { useAuth0 } from "@auth0/auth0-react";
import Layout, { Content } from 'antd/lib/layout/layout';
import { Message } from './Components/FooTypes';
import AppHeader from './Components/Header/Header';
import { useDispatch } from 'react-redux';
import { messageDeleted, messageReceived, messagesCleared } from './store/foo/fooSlice';
import { setHubConnectionState } from './store/foo/signalrSlice';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';


function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const connection: HubConnection = new HubConnectionBuilder()
    .withAutomaticReconnect()
    .withUrl("https://localhost:5001/hubs/test", { accessTokenFactory: getAccessTokenSilently })
    .build();

  connection.on("broadcastMessage", (message: Message) => dispatch(messageReceived(message)));
  connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)));
  connection.on("clearMessages", () => dispatch(messagesCleared()));
  connection.onreconnecting(() => dispatch(setHubConnectionState(connection.state)));
  connection.onreconnected(() => dispatch(setHubConnectionState(connection.state)));

  useEffect(() => {
    if (isAuthenticated) {
      connection.start().then(() => dispatch(setHubConnectionState(connection.state))).catch(err => console.error(err))

      return () => {
        connection.stop()
      }
    }
  }, [connection, isAuthenticated, dispatch])

  return (
    <Layout className="layout">
      <AppHeader />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Foo hub={connection} />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
