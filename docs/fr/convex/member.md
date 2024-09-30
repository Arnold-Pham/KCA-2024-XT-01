# Documentation du Fichier `member.tsx`

Ce fichier contient les définitions des mutations et des requêtes pour gérer les membres d'un serveur. Les opérations incluent l'ajout de membres, la récupération de la liste des membres, et la suppression de membres.

## Table des Matières

1. [Importations](#importations)
2. [Mutations](#mutations)
    - [Ajouter un Membre (c)](#ajouter-un-membre-c)
    - [Supprimer un Membre (d)](#supprimer-un-membre-d)
3. [Requêtes](#requêtes)
    - [Lister les Membres (l)](#lister-les-membres-l)
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
-   **`verifyUSMC`**: Une fonction pour valider l'utilisateur, le serveur et vérifier si l'utilisateur est membre du serveur
-   **`mutation`**: Fonction pour définir des mutations dans le contexte de votre serveur
-   **`query`**: Fonction pour définir des requêtes dans le contexte de votre serveur
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Mutations

### Ajouter un Membre (c)

```typescript
export const c = mutation({
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

-   **`userId`**: ID de l'utilisateur à ajouter en tant que membre du serveur _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur auquel l'utilisateur sera ajouté _(doit être un identifiant valide de type `server`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur et le serveur
2. Insère l'utilisateur dans la collection `member` de la base de données, associant l'utilisateur au serveur
3. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MEMBER_ADDED",
    	"details": "The user has been successfully added as a server member"
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`

---

### Supprimer un Membre (d)

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

-   **`userId`**: ID de l'utilisateur à supprimer du serveur _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur duquel l'utilisateur sera supprimé _(doit être un identifiant valide de type `server`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur et le serveur
2. Recherche le membre dans la collection `member` en utilisant l'ID de l'utilisateur
3. Vérifie si le membre existe ; si non, retourne une erreur indiquant que l'utilisateur n'est pas membre
4. Supprime le membre de la base de données
5. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MEMBER_DELETED",
    	"details": "The user has been successfully removed from the server"
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`
    -   Autres erreurs de validation via `handleError`

---

## 3. Requêtes

### Lister les Membres (l)

```typescript
export const l = query({
	args: {
		serverId: v.id('server')
	},
	handler: async (ctx, { serverId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`serverId`**: ID du serveur pour lequel la liste des membres est demandée _(doit être un identifiant valide de type `server`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider le serveur
2. Récupère la liste des membres du serveur depuis la collection `member`
3. Retourne un message de succès contenant la liste des membres ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "MEMBERS_GATHERED",
    	"details": "The server members list has been successfully retrieved",
    	"data": [
    		/* Liste des membres */
    	]
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`

---

## 4. Gestion des Erreurs

Chaque mutation et requête utilise la fonction `handleError` pour capturer et gérer les exceptions. Les erreurs peuvent inclure des problèmes de validation, des erreurs d'accès ou des erreurs inattendues. Les réponses en cas d'erreur contiendront un statut, un code et un message explicite pour faciliter le débogage.
