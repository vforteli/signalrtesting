import React, { } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from 'antd';
import { Header } from 'antd/lib/layout/layout';


function AppHeader() {
    const { loginWithRedirect, isAuthenticated, logout } = useAuth0()

    return (
        <Header>
            {isAuthenticated
                ? <Button onClick={() => logout({ returnTo: window.location.origin })} type='primary'>Log out</Button>
                : <Button onClick={() => loginWithRedirect()} type='primary'>Log In</Button>
            }
        </Header>
    );
}

export default React.memo(AppHeader);
