import { Container, CssBaseline } from '@mui/material';
import { Route, Switch } from 'react-router-dom';
import PrivateRoute from './Components/Auth/PrivateRoute';
import Bar from './Components/Bar/Bar';
import Front from './Components/Front/Front';
import AppHeader from './Components/Header/Header';
import HubNotificationMessage from './Components/HubNotificationMessage';
import MessageContainer from './Components/Messages/MessageContainer';
import { MessagesContextProvider } from './Components/Messages/MessagesContext';


function App() {
  return (
    <>
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
    </>
  );
}

export default App;
