import {
	archiveOutline,
	archiveSharp,
	bookmarkOutline,
	heartOutline,
	heartSharp,
	mailOutline,
	mailSharp,
	paperPlaneOutline,
	paperPlaneSharp,
	trashOutline,
	trashSharp,
	warningOutline,
	warningSharp
} from 'ionicons/icons'
import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote } from '@ionic/react'
import { useLocation } from 'react-router-dom'
import '@/components/Menu.css'
import { useAuth0 } from '@auth0/auth0-react'

interface AppPage {
	url: string
	iosIcon: string
	mdIcon: string
	title: string
}

const appPages: AppPage[] = [
	{
		title: 'Inbox',
		url: '/g/Inbox',
		iosIcon: mailOutline,
		mdIcon: mailSharp
	},
	{
		title: 'Outbox',
		url: '/g/Outbox',
		iosIcon: paperPlaneOutline,
		mdIcon: paperPlaneSharp
	},
	{
		title: 'Favorites',
		url: '/g/Favorites',
		iosIcon: heartOutline,
		mdIcon: heartSharp
	},
	{
		title: 'Archived',
		url: '/g/Archived',
		iosIcon: archiveOutline,
		mdIcon: archiveSharp
	},
	{
		title: 'Trash',
		url: '/g/Trash',
		iosIcon: trashOutline,
		mdIcon: trashSharp
	},
	{
		title: 'Spam',
		url: '/g/Spam',
		iosIcon: warningOutline,
		mdIcon: warningSharp
	}
]

export default function Menu() {
	const location = useLocation()
	const { user } = useAuth0()
	console.log(user)

	return (
		<IonMenu contentId="main" type="overlay">
			<IonContent>
				<IonList id="inbox-list">
					<IonListHeader>Inbox</IonListHeader>
					<IonNote>{user?.email}</IonNote>
					{appPages.map((appPage, index) => {
						return (
							<IonMenuToggle key={index} autoHide={false}>
								<IonItem
									className={location.pathname === appPage.url ? 'selected' : ''}
									routerLink={appPage.url}
									routerDirection="none"
									lines="none"
									detail={false}
								>
									<IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
									<IonLabel>{appPage.title}</IonLabel>
								</IonItem>
							</IonMenuToggle>
						)
					})}
				</IonList>
			</IonContent>
		</IonMenu>
	)
}
