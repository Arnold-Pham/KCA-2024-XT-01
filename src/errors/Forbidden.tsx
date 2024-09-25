import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

export default function Forbidden() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>403 - Forbidden</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div id="container">
					<strong>403</strong>
					<p>T'as pas le droit d'être là, fais demi tour, hop hop !</p>
				</div>
			</IonContent>
		</IonPage>
	)
}
