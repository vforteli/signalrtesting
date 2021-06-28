import React, { } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from 'react-redux';
import { clearCurrentUser } from '../../store/authentication/authenticationSlice';
import { Link } from 'react-router-dom';
import { AppBar, Button, IconButton, makeStyles, Toolbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

function AppHeader() {
    const dispatch = useDispatch();
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();
    const classes = useStyles();

    const handleLogout = () => {
        dispatch(clearCurrentUser());
        logout({ returnTo: window.location.origin })
    }

    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                    <Link to="/">Front</Link>
                    <Link to="/foo">Foo</Link>
                    <Link to="/bar">Bar</Link>
                </IconButton>
                {isAuthenticated
                    ? <Button onClick={handleLogout} >Log out</Button>
                    : <Button onClick={loginWithRedirect}>Log In</Button>
                }
            </Toolbar>
        </AppBar>
    );
}

export default React.memo(AppHeader);
