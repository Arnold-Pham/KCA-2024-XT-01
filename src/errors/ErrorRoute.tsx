import { Redirect, Route, RouteProps } from 'react-router-dom'

type ErrorCode = 400 | 401 | 403 | 404 | 500
const validErrorCodes: ErrorCode[] = [400, 401, 403, 404, 500]

interface ErrorRouteProps extends RouteProps {
	component: React.ComponentType<{ code: ErrorCode }>
}

export default function ErrorRoute({ component: Component, ...rest }: ErrorRouteProps) {
	return (
		<Route
			{...rest}
			render={({ match }) => {
				if (match.params.code) {
					const errorCode = parseInt(match.params.code, 10)
					if (validErrorCodes.includes(errorCode as ErrorCode)) {
						return <Component code={errorCode as ErrorCode} />
					}
					return <Redirect to="/e/404" />
				}
			}}
		/>
	)
}
