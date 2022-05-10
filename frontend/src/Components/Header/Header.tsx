import React, { } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch } from 'react-redux';
import { clearCurrentUser } from '../../store/authentication/authenticationSlice';
import { Link } from 'react-router-dom';
import { AppBar, Button, IconButton, Toolbar, Typography } from '@mui/material';
import { AccountCircle } from '@mui/icons-material';

function AppHeader() {
    const dispatch = useDispatch();
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const handleLogout = () => {
        dispatch(clearCurrentUser());
        logout({ returnTo: window.location.origin })
    }

    return (
        <AppBar position="sticky">
            <Toolbar>
                <IconButton edge="start" color="inherit" aria-label="menu">
                    <Link to="/">Front</Link>
                    <Link to="/foo">Foo</Link>
                    <Link to="/bar">Bar</Link>
                </IconButton>
                {isAuthenticated
                    ? <Button onClick={handleLogout} >Log out</Button>
                    : <Button onClick={loginWithRedirect}>Log In</Button>
                }
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                <IconButton
                    size="large"
                    aria-label="something"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
}

export default React.memo(AppHeader);
