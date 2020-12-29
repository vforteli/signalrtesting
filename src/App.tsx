import React, { useEffect, useState } from 'react';
import './App.css';
import Foo from './Components/Foo';
import * as signalR from "@microsoft/signalr";
import { useAuth0 } from "@auth0/auth0-react";
import Layout, { Content } from 'antd/lib/layout/layout';
import { Message } from './Components/FooTypes';
import AppHeader from './Components/Header/Header';
import { useDispatch } from 'react-redux';
import { clearMessages, messageDeleted, messageReceived } from './store/foo/fooSlice';

function App() {
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null);
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const dispatch = useDispatch();

  // todo move all this into app global slice or similar
  useEffect(() => {
    if (isAuthenticated) {
      const connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:5001/hubs/test", { accessTokenFactory: getAccessTokenSilently }).build();

      connection.on("broadcastMessage", (message: Message) => dispatch(messageReceived(message)))
      connection.on("deleteMessage", (messageId: string) => dispatch(messageDeleted(messageId)))
      connection.on("clearMessages", () => dispatch(clearMessages()))

      connection.start().catch(err => console.error(err))
      setHubConnection(connection)

      return () => {
        connection.stop()
      }
    }
  }, [isAuthenticated, getAccessTokenSilently, dispatch])



  return (
    <Layout className="layout">
      <AppHeader />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Foo hub={hubConnection} />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
