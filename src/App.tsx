import { Redirect, Route } from 'react-router-dom'
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react'
import { IonReactRouter } from '@ionic/react-router'
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
import InternalServerError from './errors/InternalServerError'
import Unauthorized from './errors/Unauthorized'
import BadRequest from './errors/BadRequest'
import Forbidden from './errors/Forbidden'
import NotFound from './errors/NotFound'
import Menu from './components/Menu'

setupIonicReact()

const App: React.FC = () => (
	<IonApp>
		<IonReactRouter>
			<IonSplitPane contentId="main">
				<Menu />
				<IonRouterOutlet id="main">
					<Route path="/" exact component={Home} />
					<Route path="/500" exact component={InternalServerError} />
					<Route path="/401" exact component={Unauthorized} />
					<Route path="/400" exact component={BadRequest} />
					<Route path="/403" exact component={Forbidden} />
					<Route path="/404" exact component={NotFound} />
				</IonRouterOutlet>
			</IonSplitPane>
		</IonReactRouter>
	</IonApp>
)

export default App
