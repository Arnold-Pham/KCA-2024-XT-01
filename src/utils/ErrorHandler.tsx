import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'
import { home } from 'ionicons/icons'

type ErrorCode = 400 | 401 | 403 | 404 | 500

const errorMessages: { [key in ErrorCode]: { error: string; title: string; message: string } } = {
	400: {
		error: '400',
		title: '400 - Requête incorrecte (Bad\u00A0Request)',
		message: 'Le serveur ne sais pas ce que tu veux faire. Moi\u00A0non\u00A0plus...'
	},
	401: {
		error: '401',
		title: '401 - Non autorisé (Unauthorized)',
		message: 'Va te connecter et reviens'
	},
	403: {
		error: '403',
		title: '403 - Accès interdit (Forbidden)',
		message: "T'as pas le droit d'être là, fais\u00A0demi\u00A0tour,\u00A0hop\u00A0hop!"
	},
	404: {
		error: '404',
		title: '404 - Page non trouvée (Not\u00A0Found)',
		message: "Cette page n'existe pas, tu\u00A0voulais\u00A0aller\u00A0où\u00A0?"
	},
	500: {
		error: '500',
		title: '500 - Erreur interne du serveur (Internal\u00A0Server\u00A0Error)',
		message: 'Le serveur a dû fondre, je\u00A0vais\u00A0essayer\u00A0de\u00A0régler\u00A0ça, reviens\u00A0plus\u00A0tard'
	}
}

export default function ErrorHandler({ code }: { code: ErrorCode }) {
	return (
		<IonPage>
			<IonHeader>
				<IonToolbar>
					<IonButtons slot="start">
						<IonMenuButton />
					</IonButtons>
					<IonTitle>{errorMessages[code].error}</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<div id="container">
					<strong>{errorMessages[code].title}</strong>
					<p>{errorMessages[code].message}</p>
					<IonButton routerLink="/">
						<IonIcon slot="icon-only" icon={home}></IonIcon>
					</IonButton>
				</div>
			</IonContent>
		</IonPage>
	)
}
