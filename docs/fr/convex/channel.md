# Documentation du Fichier `channel.tsx`

Ce fichier contient les définitions des mutations et des requêtes pour gérer les canaux dans votre application de messagerie. Il utilise un système de gestion d'erreurs et de validation pour garantir que les opérations se déroulent correctement.

## Table des Matières

1. [Importations](#importations)
2. [Mutations](#mutations)
    - [Créer un Canal (c)](#creer-un-canal-c)
    - [Mettre à jour un Canal (u)](#mettre-a-jour-un-canal-u)
    - [Supprimer un Canal (d)](#supprimer-un-canal-d)
3. [Requêtes](#requêtes)
    - [Lister les Canaux (l)](#lister-les-canaux-l)
4. [Gestion des Erreurs](#gestion-des-erreurs)

---

## 1. Importations

```typescript
import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
```

-   **`error`**: Un objet contenant diverses erreurs pré-définies pour les validations
-   **`handleError`**: Une fonction utilisée pour gérer les erreurs d'appels à convex
-   **`verifyUSCM`**: Une fonction pour valider l'utilisateur, le serveur, le canal et vérifie si l'utilisateur est membre du serveur
-   **`mutation` et `query`**: Fonctions pour définir des mutations et des requêtes dans le contexte de votre serveur
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Mutations

### Créer un Canal (c)

```typescript
export const c = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		name: v.string()
	},
	handler: async (ctx, { name, userId, serverId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui crée le canal _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur dans lequel le canal sera créé _(doit être un identifiant valide de type `server`)_
-   **`name`**: Nom du canal _(doit être une chaîne de caractères non vide)_

#### Fonctionnement

1. Vérifie si le nom du canal est fourni et s'il n'est pas vide
2. Vérifie que le nom ne dépasse pas 32 caractères
3. Utilise `verifyUSCM` pour valider l'utilisateur et le serveur
4. Vérifie si le serveur a atteint la limite de 32 canaux
5. Insère un nouveau canal dans la base de données avec le type `'text'`
6. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CHANNEL_CREATED",
    	"details": "The channel has been successfully created"
    }
    ```

-   **Erreurs possibles** :
    -   `error.channelNameEmpty`
    -   `error.channelNameTooLong`
    -   `error.userNotMember`
    -   `error.tooManyChannels`

---

### Mettre à jour un Canal (u)

```typescript
export const u = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel'),
		name: v.optional(v.string()),
		type: v.optional(v.union(v.literal('text'), v.literal('vocal')))
	},
	handler: async (ctx, { userId, serverId, channelId, name, type }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui souhaite mettre à jour le canal
-   **`serverId`**: ID du serveur auquel appartient le canal
-   **`channelId`**: ID du canal à mettre à jour
-   **`name`** _(optionnel)_: Nouveau nom du canal
-   **`type`** _(optionnel)_: Nouveau type du canal _(doit être 'text' ou 'vocal')_

#### Fonctionnement

1. Vérifie si le nom ou le type du canal est fourni pour la mise à jour
2. Vérifie si le nom est valide _(non vide, longueur maximale de 32 caractères)_
3. Vérifie si le type est valide _(doit être 'text' ou 'vocal')_
4. Utilise `verifyUSCM` pour valider l'utilisateur et le serveur
5. Vérifie si le canal existe dans la base de données
6. Vérifie si l'utilisateur a les droits d'accès pour modifier le canal
7. Met à jour le canal dans la base de données avec les nouvelles valeurs
8. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CHANNEL_UPDATED",
    	"details": "The channel has been successfully updated"
    }
    ```

-   **Erreurs possibles** :
    -   `error.channelUnchanged`
    -   `error.channelNameEmpty`
    -   `error.channelNameTooLong`
    -   `error.channelTypeInvalid`
    -   `error.userNotAuthorized`
    -   `error.unknownServer`
    -   `error.unknownChannel`

---

### Supprimer un Canal (d)

```typescript
export const d = mutation({
	args: {
		userId: v.id('user'),
		serverId: v.id('server'),
		channelId: v.id('channel')
	},
	handler: async (ctx, { userId, serverId, channelId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui souhaite supprimer le canal
-   **`serverId`**: ID du serveur auquel appartient le canal
-   **`channelId`**: ID du canal à supprimer

#### Fonctionnement

1. Utilise `verifyUSCM` pour valider l'utilisateur, le serveur et le canal
2. Vérifie si le serveur existe dans la base de données
3. Vérifie si l'utilisateur a les droits d'accès pour supprimer le canal
4. Récupère tous les messages associés au canal
5. Supprime chaque message de la base de données
6. Supprime le canal de la base de données
7. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CHANNEL_DELETED",
    	"details": "The channel and all associated messages have been deleted"
    }
    ```

-   **Erreurs possibles** :
    -   `error.unknownServer`
    -   `error.userNotAuthorized`
    -   `error.unknownChannel`
    -   `error.userNotMember`

---

## 3. Requêtes

### Lister les Canaux (l)

```typescript
export const l = query({
	args: {
		userId: v.id('user'),
		serverId: v.id('server')
	},
	handler: async (ctx, { userId, serverId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui demande la liste des canaux
-   **`serverId`**: ID du serveur dont on souhaite obtenir les canaux

#### Fonctionnement

1. Utilise `verifyUSCM` pour valider l'utilisateur et le serveur
2. Récupère tous les canaux associés au serveur dans la base de données
3. Retourne la liste des canaux ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CHANNELS_GATHERED",
    	"details": "Channel list has been successfully retrieved",
    	"data": [
    		/* Liste des canaux */
    	]
    }
    ```

-   **Erreurs possibles** :
    -   `error.unknownServer`
    -   `error.userNotMember`

---

## 4. Gestion des Erreurs

Chaque fonction de mutation et de requête utilise la fonction `handleError` pour capturer et gérer les exceptions. Les erreurs peuvent inclure des problèmes de validation, des erreurs d'accès ou des erreurs inattendues. Les réponses en cas d'erreur contiendront un statut, un code et un message explicite pour faciliter le débogage.
