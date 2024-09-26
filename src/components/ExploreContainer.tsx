import '@/components/ExploreContainer.css'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'
import { useAuth0 } from '@auth0/auth0-react'

interface ContainerProps {
	name: string
}

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
	const { user, isAuthenticated } = useAuth0()

	if (isAuthenticated) console.log(user)
	return (
		<div id="container">
			<strong>{name}</strong>
			<p>
				Explore{' '}
				<a target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components">
					UI Components
				</a>
			</p>
			<LoginButton />
			<LogoutButton />
		</div>
	)
}

export default ExploreContainer
