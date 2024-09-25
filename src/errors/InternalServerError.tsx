import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

export default function InternalServerError() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>500 - Internal Server Error</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div id="container">
					<strong>500</strong>
					<p>Le serveur a dû fondre, je vais essayer de régler ça. Reviens plus tard.</p>
				</div>
			</IonContent>
		</IonPage>
	)
}
