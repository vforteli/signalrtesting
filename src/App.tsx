import React, { useEffect, useState } from 'react';
import './App.css';
import Foo from './Components/Foo';
import * as signalR from "@microsoft/signalr";
import { useAuth0 } from "@auth0/auth0-react";
import Layout, { Content } from 'antd/lib/layout/layout';
import { Message } from './Components/FooTypes';
import AppHeader from './Components/Header/Header';

function App() {
  const [messages, setMessages] = useState<Message[]>([])
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null)
  const { isAuthenticated, getAccessTokenSilently } = useAuth0()

  useEffect(() => {
    if (isAuthenticated) {
      (async () => {
        try {
          const response = await fetch('https://localhost:5001/api/messages')
          setMessages(await response.json())
        } catch (e) {
          console.error(e)
        }
      })()

      const connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:5001/hubs/test", { accessTokenFactory: getAccessTokenSilently }).build();

      connection.on("broadcastMessage", (payload: Message) => setMessages(m => m = [...m, payload]))

      connection.on("deleteMessage", (messageId: string) => setMessages(m => m = m.filter(o => o.messageId !== messageId)))

      connection.on("clearMessages", () => setMessages([]))

      connection.start().catch(err => console.error(err))
      setHubConnection(connection)

      return () => {
        connection.stop()
      }
    }
  }, [isAuthenticated, getAccessTokenSilently])



  return (
    <Layout className="layout">
      <AppHeader />
      <Content style={{ padding: '0 50px' }}>
        <div className="site-layout-content">
          <Foo hub={hubConnection} messages={messages} />
        </div>
      </Content>
    </Layout>
  );
}

export default App;
