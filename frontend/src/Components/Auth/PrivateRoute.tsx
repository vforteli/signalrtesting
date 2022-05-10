import { Route, RouteProps } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

const PrivateRoute = ({ component, ...args }: RouteProps) => (
    <Route
        component={withAuthenticationRequired(component!)}
        {...args}
    />
);

export default PrivateRoute;