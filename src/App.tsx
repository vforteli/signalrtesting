import React, { useEffect, useState } from 'react';
import './App.css';
import Foo from './Components/Foo';
import * as signalR from "@microsoft/signalr";

export interface Message {
  name: string;
  message: string;
}

const connection: signalR.HubConnection = new signalR.HubConnectionBuilder().withUrl("https://localhost:5001/hubs/test").build();

function App() {
  const [messages, updateMessages] = useState<Message[]>([])

  useEffect(() => {
    connection.on("broadcastMessage", (name: string, message: string) => {
      updateMessages(m => m = [...m, { name, message }])
    });

    connection.on("deleteMessage", (key: string) => {
      updateMessages(m => m = m.filter(o => o.name + o.message !== key))
    });

    connection.start().catch(err => console.error(err));

    return function cleanup() {
      console.debug('Disconnecting from hub')
      connection.stop()
    };
  }, [])



  return (
    <div className="App">
      <Foo hub={connection} messages={messages} />
    </div>
  );
}

export default App;
