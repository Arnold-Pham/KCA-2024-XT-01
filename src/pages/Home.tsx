import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonRouterOutlet, IonSplitPane, IonTitle, IonToolbar } from '@ionic/react'
import ExploreContainer from '../components/ExploreContainer'
import { useAuth0 } from '@auth0/auth0-react'
import { useParams } from 'react-router'
import Menu from '../components/Menu'
import '@/pages/Home.css'

export default function Home() {
	const { name } = useParams<{ name: string }>()
	const { isAuthenticated } = useAuth0()

	return (
		<IonSplitPane contentId="main">
			{isAuthenticated && <Menu />}
			<IonRouterOutlet id="main">
				<IonPage>
					<IonHeader>
						<IonToolbar>
							<IonButtons slot="start">
								<IonMenuButton />
							</IonButtons>
							<IonTitle>{name ? name : 'Projet J'}</IonTitle>
						</IonToolbar>
					</IonHeader>

					<IonContent fullscreen>
						<IonHeader collapse="condense">
							<IonToolbar>
								<IonTitle size="large">{name ? name : 'Projet J'}</IonTitle>
							</IonToolbar>
						</IonHeader>
						<ExploreContainer name={name} />
					</IonContent>
				</IonPage>
			</IonRouterOutlet>
		</IonSplitPane>
	)
}
