import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react'

type ErrorCode = 400 | 401 | 403 | 404 | 500

const errorMessages: { [key in ErrorCode]: { error: string; title: string; message: string } } = {
	400: {
		error: '400',
		title: '400 - Requête incorrecte (Bad Request)',
		message: 'Le serveur ne sais pas ce que tu veux faire. Moi non plus...'
	},
	401: {
		error: '401',
		title: '401 - Non autorisé (Unauthorized)',
		message: 'Va te connecter et reviens'
	},
	403: {
		error: '403',
		title: '403 - Accès interdit (Forbidden)',
		message: "T'as pas le droit d'être là, fais demi tour, hop hop !"
	},
	404: {
		error: '404',
		title: '404 - Page non trouvée (Not Found)',
		message: "Cette page n'existe pas, tu voulais aller où ?"
	},
	500: {
		error: '500',
		title: '500 - Erreur interne du serveur (Internal Server Error)',
		message: 'Le serveur a dû fondre, je vais essayer de régler ça, reviens plus tard'
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
				</div>
			</IonContent>
		</IonPage>
	)
}
