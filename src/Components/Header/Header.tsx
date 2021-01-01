import React, { } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';
import { Header } from 'antd/lib/layout/layout';
import { useDispatch } from 'react-redux';
import { clearCurrentUser } from '../../store/authentication/authenticationSlice';


function AppHeader() {
    const dispatch = useDispatch();
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0();

    const handleLogout = () => {
        dispatch(clearCurrentUser());
        logout({ returnTo: window.location.origin })
    }

    return (
        <Header>
            {isAuthenticated
                ? <Button onClick={handleLogout} type='primary'>Log out</Button>
                : <Button onClick={loginWithRedirect} type='primary'>Log In</Button>
            }
        </Header>
    );
}

export default React.memo(AppHeader);
