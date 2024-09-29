import { ConvexProviderWithAuth0 } from 'convex/react-auth0'
import { UserProvider } from './utils/UserProvider'
import { Auth0Provider } from '@auth0/auth0-react'
import { ConvexReactClient } from 'convex/react'
import ReactDOM from 'react-dom/client'
import React from 'react'
import App from './App'

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string)

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Auth0Provider
			domain={import.meta.env.VITE_AUTH0_DOMAIN}
			clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
			authorizationParams={{ redirect_uri: window.location.origin }}
			useRefreshTokens={true}
			cacheLocation="localstorage"
		>
			<ConvexProviderWithAuth0 client={convex}>
				<UserProvider>
					<App />
				</UserProvider>
			</ConvexProviderWithAuth0>
		</Auth0Provider>
	</React.StrictMode>
)
