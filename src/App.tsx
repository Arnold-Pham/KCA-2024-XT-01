import { IonApp, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
import ProtectedRoute from './utils/ProtectedRoute'
import { App as CapApp } from '@capacitor/app'
import { useAuth0 } from '@auth0/auth0-react'
import { Browser } from '@capacitor/browser'
import { Route } from 'react-router-dom'
import { useEffect } from 'react'

import ErrorHandler from './utils/ErrorHandler'
import ErrorRoute from './utils/ErrorRoute'
import Home from './pages/Home'

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css'
import '@ionic/react/css/structure.css'
import '@ionic/react/css/typography.css'

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css'
import '@ionic/react/css/float-elements.css'
import '@ionic/react/css/text-alignment.css'
import '@ionic/react/css/text-transformation.css'
import '@ionic/react/css/flex-utils.css'
import '@ionic/react/css/display.css'

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css'

/* Theme variables */
import './theme/variables.css'

setupIonicReact()

export default function App() {
	const { handleRedirectCallback } = useAuth0()

	useEffect(() => {
		CapApp.addListener('appUrlOpen', async ({ url }) => {
			if (url.includes('state') && (url.includes('code') || url.includes('error'))) await handleRedirectCallback(url)
			await Browser.close()
		})
	}, [handleRedirectCallback])

	return (
		<IonApp>
			<IonReactRouter>
				<Route path="/" exact component={Home} />
				<ProtectedRoute path="/g/:name" exact component={Home} />
				<ErrorRoute path="/e/:code" exact component={ErrorHandler} />
			</IonReactRouter>
		</IonApp>
	)
}
