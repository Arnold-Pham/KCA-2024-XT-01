# Documentation du Fichier `message.tsx`

Ce fichier contient les définitions des mutations et des requêtes pour gérer les messages dans un canal de serveur. Les opérations incluent l'envoi de messages, la récupération des messages, la mise à jour des messages, et la suppression des messages.

## Table des Matières

1. [Importations](#importations)
2. [Mutations](#mutations)
    - [Envoyer un Message (c)](#envoyer-un-message-c)
    - [Mettre à Jour un Message (u)](#mettre-à-jour-un-message-u)
    - [Supprimer un Message (d)](#supprimer-un-message-d)
3. [Requêtes](#requêtes)
    - [Lister les Messages (l)](#lister-les-messages-l)
4. [Gestion des Erreurs](#gestion-des-erreurs)

---

## 1. Importations

```typescript
import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { Doc } from './_generated/dataModel'
import { v } from 'convex/values'
```

-   **`error`**: Un objet contenant des erreurs pré-définies pour les validations
-   **`handleError`**: Une fonction utilisée pour gérer les erreurs d'appels à convex
-   **`verifyUSCM`**: Une fonction pour valider l'utilisateur, le serveur, le canal et vérifie si l'utilisateur est membre du serveur
-   **`mutation`**: Fonction pour définir des mutations dans le contexte de votre serveur
-   **`query`**: Fonction pour définir des requêtes dans le contexte de votre serveur
-   **`Doc`**: Type utilisé pour représenter un document dans la base de données
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Mutations

### Envoyer un Message (c)

```typescript
export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		content: v.string()
	},
	handler: async (ctx, { userId, serverId, channelId, content }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui envoie le message _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur auquel le message est envoyé _(doit être un identifiant valide de type `server`)_
-   **`channelId`**: ID du canal dans lequel le message est envoyé _(doit être un identifiant valide de type `channel`)_
-   **`content`**: Contenu du message _(doit être une chaîne de caractères)_

#### Fonctionnement

1. Vérifie si le contenu est vide ou dépasse 1000 caractères
2. Utilise `verifyUSMC` pour valider l'utilisateur, le serveur et le canal
3. Insère le message dans la collection `message` de la base de données
4. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MESSAGE_SENT",
    	"details": "The message has been successfully sent"
    }
    ```

-   **Erreurs possibles** :
    -   `error.messageEmpty`
    -   `error.messageTooLong`

---

### Mettre à Jour un Message (u)

```typescript
export const u = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		messageId: v.id('message'),
		content: v.string()
	},
	handler: async (ctx, { userId, serverId, channelId, messageId, content }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui souhaite mettre à jour le message _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur dans lequel le message est _(doit être un identifiant valide de type `server`)_
-   **`channelId`**: ID du canal dans lequel se trouve le message _(doit être un identifiant valide de type `channel`)_
-   **`messageId`**: ID du message à mettre à jour _(doit être un identifiant valide de type `message`)_
-   **`content`**: Nouveau contenu du message _(doit être une chaîne de caractères)_

#### Fonctionnement

1. Vérifie si le contenu est vide ou dépasse 1000 caractères
2. Utilise `verifyUSMC` pour valider l'utilisateur, le serveur et le canal
3. Récupère le message de la base de données
4. Vérifie si le message existe, s'il est supprimé, si l'utilisateur est autorisé à le modifier, et si le nouveau contenu est différent
5. Met à jour le message dans la base de données
6. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MESSAGE_UPDATED",
    	"details": "The message has been successfully updated"
    }
    ```

-   **Erreurs possibles** :
    -   `error.messageEmpty`
    -   `error.messageTooLong`
    -   `error.unknownMessage`
    -   `error.messageDeleted`
    -   `error.userNotAuthorized`
    -   `error.messageUnchanged`

---

### Supprimer un Message (d)

```typescript
export const d = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		messageId: v.id('message')
	},
	handler: async (ctx, args) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui souhaite supprimer le message _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur dans lequel se trouve le message _(doit être un identifiant valide de type `server`)_
-   **`channelId`**: ID du canal dans lequel se trouve le message _(doit être un identifiant valide de type `channel`)_
-   **`messageId`**: ID du message à supprimer _(doit être un identifiant valide de type `message`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur, le serveur et le canal
2. Récupère le message de la base de données
3. Vérifie si le message existe, s'il est supprimé, et si l'utilisateur est autorisé à le supprimer
4. Met à jour le message pour le marquer comme supprimé
5. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MESSAGE_DELETED",
    	"details": "The message has been successfully deleted"
    }
    ```

-   **Erreurs possibles** :
    -   `error.unknownMessage`
    -   `error.messageDeleted`
    -   `error.userNotAuthorized`

---

## 3. Requêtes

### Lister les Messages (l)

```typescript
export const l = query({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel')
	},
	handler: async (ctx, args) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur effectuant la requête _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur dans lequel se trouvent les messages _(doit être un identifiant valide de type `server`)_
-   **`channelId`**: ID du canal dont les messages doivent être récupérés _(doit être un identifiant valide de type `channel`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur, le serveur et le canal
2. Récupère les derniers 50 messages du canal spécifié
3. Pour chaque message, récupère les informations de l'utilisateur qui a envoyé le message
4. Retourne un message de succès contenant la liste des messages avec les informations des utilisateurs

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MESSAGES_GATHERED",
    	"details": "The last fifty messages have been successfully retrieved along with user information",
    	"data": [
    		/* Liste des messages avec informations utilisateurs */
    	]
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`

---

## 4. Gestion des Erreurs

Les erreurs sont gérées à l'aide de la fonction `handleError`, qui prend en entrée l'erreur capturée et retourne un message d'erreur approprié. Les erreurs peuvent inclure des messages d'erreur prédéfinis pour des situations spécifiques (ex. contenu vide, message trop long, utilisateur non autorisé, etc.).
