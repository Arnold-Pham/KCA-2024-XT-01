# Documentation des Erreurs et des Fonctions de Validation

[English](../../en/convex/errors.md)

Cette documentation détaille les différentes erreurs pouvant survenir dans l'application et les fonctions utilisées pour les gérer

## Table des Matières

1. [Erreurs Courantes](#erreurs-courantes)
2. [Fonction de Gestion des Erreurs](#fonction-de-gestion-des-erreurs)
3. [Fonction `verifyUSMC`](#fonction-verifyUSMC)

---

## 1. Erreurs Courantes

Ce module contient un ensemble d'erreurs pré-définies avec des codes de statut HTTP et des messages descriptifs. Elles sont regroupées par domaine fonctionnel _(utilisateur, serveur, message, etc.)_

### User

| Error Name          | Code | Message             | Details                                                          |
| ------------------- | ---- | ------------------- | ---------------------------------------------------------------- |
| `unknownUser`       | 404  | UNKNOWN_USER        | The specified user could not be found in the database            |
| `usernameEmpty`     | 400  | USERNAME_EMPTY      | The username cannot be empty                                     |
| `usernameTooShort`  | 400  | USERNAME_TOO_SHORT  | The username must be at least 3 characters long                  |
| `usernameTooLong`   | 400  | USERNAME_TOO_LONG   | The username cannot exceed 20 characters                         |
| `authIdEmpty`       | 400  | AUTH_ID_EMPTY       | The authentication ID cannot be empty                            |
| `userNotAuthorized` | 403  | USER_NOT_AUTHORIZED | You do not have the necessary permissions to perform this action |

### Server

| Error Name           | Code | Message                     | Details                                                         |
| -------------------- | ---- | --------------------------- | --------------------------------------------------------------- |
| `unknownServer`      | 404  | UNKNOWN_SERVER              | The specified server could not be found in the database         |
| `serverNameEmpty`    | 400  | SERVER_NAME_EMPTY           | The server name cannot be empty                                 |
| `serverNameTooShort` | 400  | SERVER_NAME_TOO_SHORT       | The server name must be at least 3 characters long              |
| `serverNameTooLong`  | 400  | SERVER_NAME_TOO_LONG        | The server name cannot exceed 50 characters                     |
| `serverDescTooLong`  | 400  | SERVER_DESCRIPTION_TOO_LONG | The server description cannot exceed 200 characters             |
| `serverNotOwned`     | 403  | SERVER_NOT_OWNED            | You do not have permission to perform this action on the server |
| `userNotMember`      | 403  | NOT_A_MEMBER                | The user is not a member of this server                         |

### Channel

| Error Name           | Code | Message               | Details                                                                     |
| -------------------- | ---- | --------------------- | --------------------------------------------------------------------------- |
| `unknownChannel`     | 404  | UNKNOWN_CHANNEL       | The specified channel could not be found in the database                    |
| `channelNameEmpty`   | 400  | CHANNEL_NAME_EMPTY    | The channel name cannot be empty                                            |
| `channelNameTooLong` | 400  | CHANNEL_NAME_TOO_LONG | The channel name cannot exceed 50 characters                                |
| `channelUnchanged`   | 400  | CHANNEL_UNCHANGED     | No changes were made to the channel information                             |
| `channelTypeInvalid` | 400  | CHANNEL_TYPE_INVALID  | The specified channel type is invalid, allowed types are "text" and "vocal" |
| `tooManyChannels`    | 403  | TOO_MANY_CHANNELS     | This server has reached its maximum number of channels                      |

### Invite Code

| Error Name                  | Code | Message                       | Details                                                          |
| --------------------------- | ---- | ----------------------------- | ---------------------------------------------------------------- |
| `inviteCodeExpired`         | 410  | INVITE_CODE_EXPIRED           | The invite code has expired and cannot be used                   |
| `inviteCodeInvalid`         | 400  | INVALID_INVITE_CODE           | The provided invite code is invalid                              |
| `inviteCodeMaxUsesExceeded` | 410  | INVITE_CODE_MAX_USES_EXCEEDED | The maximum number of uses for this invite code has been reached |
| `memberAlreadyExists`       | 409  | MEMBER_ALREADY_EXISTS         | The user is already a member of this server                      |

### Message

| Error Name         | Code | Message           | Details                                                                   |
| ------------------ | ---- | ----------------- | ------------------------------------------------------------------------- |
| `unknownMessage`   | 404  | UNKNOWN_MESSAGE   | The specified message could not be found in the database                  |
| `messageEmpty`     | 400  | MESSAGE_EMPTY     | The message content cannot be empty                                       |
| `messageTooLong`   | 400  | MESSAGE_TOO_LONG  | The message content exceeds the maximum allowed length of 1000 characters |
| `messageDeleted`   | 410  | MESSAGE_DELETED   | The message has been deleted and cannot be accessed                       |
| `messageUnchanged` | 400  | MESSAGE_UNCHANGED | No changes were made to the message content                               |

---

## 2. Fonction de Gestion des Erreurs

### `handleError`

La fonction `handleError` est utilisée pour capturer et gérer les erreurs non prévues dans l'application

```typescript
export function handleError(error: unknown) {
	throw error instanceof Error
		? {
				status: 'error',
				code: 500,
				message: error.message || 'Server Error'
			}
		: {
				status: 'error',
				code: 500,
				message: 'Unknown Error',
				details: String(error)
			}
}
```

-   Si l'erreur est une instance d'`Error`, elle renvoie un message d'erreur avec le code 500 et le message correspondant
-   Si l'erreur n'est pas une instance d'`Error`, elle renvoie un message d'erreur générique avec le code 500

---

## 3. Fonction `verifyUSMC`

La fonction `verifyUSMC` est utilisée pour vérifier l'existence d'un utilisateur, d'un serveur et/ou d'un salon, et vérifier si l'utilisateur est membre d'un serveur donné

### Paramètres

-   `ctx`: Le contexte de la mutation/requête _(`MutationCtx`/`QueryCtx`)_
-   `userId` _(optionnel)_: L'ID de l'utilisateur
-   `serverId` _(optionnel)_: L'ID du serveur
-   `channelId` _(optionnel)_: L'ID du salon

### Exemple de Code

```typescript
export async function verifyUSMC(
	ctx: MutationCtx | QueryCtx,
	{
		userId,
		serverId,
		channelId
	}: {
		userId?: Id<'user'>
		serverId?: Id<'server'>
		channelId?: Id<'channel'>
	}
) {
	if (userId) {
		const user = await ctx.db.get(userId)
		if (!user) return error.unknownUser
	}

	if (serverId) {
		const server = await ctx.db.get(serverId)
		if (!server) return error.unknownServer
	}

	if (userId && serverId) {
		const member = await ctx.db
			.query('member')
			.filter(q => q.and(q.eq(q.field('userId'), userId), q.eq(q.field('serverId'), serverId)))
			.first()
		if (!member) return error.userNotMember
	}

	if (channelId) {
		const channel = await ctx.db.get(channelId)
		if (!channel) return error.unknownChannel
	}

	return null
}
```

### Fonctionnement

-   Vérifie si l'utilisateur existe _(`userId`)_
-   Vérifie si le serveur existe _(`serverId`)_
-   Vérifie si l'utilisateur est un membre du serveur _(`userId` et `serverId`)_
-   Vérifie si le salon existe _(`channelId`)_

Si une entité n'est pas trouvée, la fonction retourne l'erreur correspondante _(`unknownUser`, `unknownServer`, `userNotMember`, `unknownChannel`)_
Si tout est valide, la fonction retourne `null`
