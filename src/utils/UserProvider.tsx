import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useHistory } from 'react-router-dom'

interface UserInfo {
	id: string
	username: string
	email: string
}

interface UserContextProps {
	userInfo: UserInfo | null
	setUserInfo: (info: UserInfo | null) => void
}

const UserContext = createContext<UserContextProps | undefined>(undefined)

export const useUser = (): UserContextProps => {
	const context = useContext(UserContext)
	if (!context) throw new Error('useUser must be used within a UserProvider')
	return context
}

interface UserProviderProps {
	children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
	const { isAuthenticated, user } = useAuth0()
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
	const history = useHistory()

	useEffect(() => {
		const fetchUserData = async () => {
			const storedUser = localStorage.getItem('user')

			if (storedUser) {
				setUserInfo(JSON.parse(storedUser))
			} else if (isAuthenticated && user) {
				const auth0Id = user.sub
				try {
					const response = await fetch(`/api/user/${auth0Id}`)

					if (response.ok) {
						const userData: UserInfo = await response.json()
						if (userData) {
							setUserInfo(userData)
							localStorage.setItem('user', JSON.stringify(userData))
						} else {
							history.push('/complete-profile')
						}
					} else {
						console.error('Erreur lors de la récupération des données utilisateur')
					}
				} catch (error) {
					console.error('Erreur réseau ou serveur :', error)
				}
			}
		}

		fetchUserData()
	}, [isAuthenticated, user, history])

	return <UserContext.Provider value={{ userInfo, setUserInfo }}>{children}</UserContext.Provider>
}
