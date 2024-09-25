import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

export default function Unauthorized() {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>401 - Unauthorized</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div id="container">
					<strong>401</strong>
					<p>Va te connecter et reviens.</p>
				</div>
			</IonContent>
		</IonPage>
	)
}
