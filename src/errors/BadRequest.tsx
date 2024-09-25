import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

export default function BadRequest() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>400 - Bad Request</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div id="container">
					<strong>400</strong>
					<p>Le serveur ne sais pas ce que tu veux faire. Moi non plus...</p>
				</div>
			</IonContent>
		</IonPage>
	)
}
