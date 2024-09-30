# Documentation du Fichier `serveur.tsx`

Ce fichier contient les définitions des mutations et des requêtes pour gérer les serveurs. Les opérations incluent la création d'un serveur, la récupération des serveurs d'un utilisateur et la suppression d'un serveur.

## Table des Matières

1. [Importations](#importations)
2. [Mutations](#mutations)
    - [Créer un Serveur (c)](#créer-un-serveur-c)
    - [Supprimer un Serveur (d)](#supprimer-un-serveur-d)
3. [Requêtes](#requêtes)
    - [Lister les Serveurs (l)](#lister-les-serveurs-l)
4. [Gestion des Erreurs](#gestion-des-erreurs)

---

## 1. Importations

```typescript
import { error, handleError, verifyUSMC } from './errors'
import { mutation, query } from './_generated/server'
import { v } from 'convex/values'
```

-   **`error`**: Un objet contenant des erreurs pré-définies pour les validations
-   **`handleError`**: Une fonction utilisée pour gérer les erreurs d'appels à convex
-   **`verifyUSMC`**: Une fonction pour valider l'utilisateur, le serveur, le canal et vérifie si l'utilisateur est membre du serveur
-   **`mutation`**: Fonction pour définir des mutations dans le contexte de votre serveur
-   **`query`**: Fonction pour définir des requêtes dans le contexte de votre serveur
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Mutations

### Créer un Serveur (c)

```typescript
export const c = mutation({
	args: {
		userId: v.id('user'),
		name: v.string(),
		description: v.optional(v.union(v.string(), v.null()))
	},
	handler: async (ctx, { userId, name, description }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui crée le serveur _(doit être un identifiant valide de type `user`)_
-   **`name`**: Nom du serveur _(doit être une chaîne de caractères)_
-   **`description`**: Description du serveur (optionnelle, peut être une chaîne ou `null`)

#### Fonctionnement

1. Vérifie si le nom du serveur est vide ou dépasse 50 caractères
2. Utilise `verifyUSMC` pour valider l'utilisateur
3. Vérifie si la description dépasse 200 caractères, si elle est fournie
4. Insère le serveur dans la collection `server` de la base de données
5. Insère l'utilisateur comme membre du serveur dans la collection `member`
6. Crée un canal "Général" pour le serveur dans la collection `channel`
7. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "SERVER_CREATED",
    	"details": "The server has been successfully created with a \"General\" channel"
    }
    ```

-   **Erreurs possibles** :
    -   `error.serverNameEmpty`
    -   `error.serverNameTooLong`
    -   `error.serverDescTooLong`

---

### Supprimer un Serveur (d)

```typescript
export const d = mutation({
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

-   **`userId`**: ID de l'utilisateur qui souhaite supprimer le serveur _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur à supprimer _(doit être un identifiant valide de type `server`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur
2. Récupère le serveur de la base de données
3. Vérifie si le serveur existe et si l'utilisateur est autorisé à le supprimer _(soit le créateur, soit le propriétaire)_
4. Récupère tous les canaux associés au serveur et supprime tous les messages dans ces canaux
5. Supprime les membres associés au serveur
6. Supprime le serveur lui-même
7. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "SERVER_DELETED",
    	"details": "The server, its members, channels, and messages have been successfully deleted"
    }
    ```

-   **Erreurs possibles** :
    -   `error.unknownServer`
    -   `error.userNotAuthorized`
    -   Autres erreurs de validation via `handleError`.

---

## 3. Requêtes

### Lister les Serveurs (l)

```typescript
export const l = query({
	args: {
		userId: v.id('user')
	},
	handler: async (ctx, { userId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur effectuant la requête _(doit être un identifiant valide de type `user`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur
2. Récupère tous les membres associés à l'utilisateur dans la collection `member`
3. Pour chaque membre, récupère les serveurs associés dans la collection `server`
4. Retourne un message de succès contenant la liste des serveurs

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "SERVER_GATHERED",
    	"details": "The list of servers has been successfully retrieved",
    	"data": [
    		/* Liste des serveurs */
    	]
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`

---

## 4. Gestion des Erreurs

Les erreurs sont gérées à l'aide de la fonction `handleError`, qui prend en entrée l'erreur capturée et retourne un message d'erreur approprié. Les erreurs peuvent inclure des messages d'erreur prédéfinis pour des situations spécifiques (ex. nom de serveur vide, serveur inconnu, utilisateur non autorisé, etc.)
