import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useUser } from './UserProvider'

interface ProtectedRouteProps extends RouteProps {
	component: React.ComponentType<any>
}

export default function ProtectedRoute({ component: Component, ...rest }: ProtectedRouteProps) {
	const userInfo = useUser()

	return <Route {...rest} render={props => (userInfo ? <Component {...props} /> : <Redirect to="/e/403" />)} />
}
