import '@/components/ExploreContainer.css'
import LogoutButton from './LogoutButton'
import LoginButton from './LoginButton'

interface ContainerProps {
	name: string
}

export default function ExploreContainer({ name }: ContainerProps) {
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
