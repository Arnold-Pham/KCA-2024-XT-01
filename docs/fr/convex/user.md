# Documentation du Fichier des Utilisateurs

Ce fichier contient les mutations et requêtes permettant la gestion des utilisateurs dans l'application, incluant la création, la mise à jour et la récupération des informations d'un utilisateur.

## Table des Matières

1. [Importations](#importations)
2. [Mutations](#mutations)
    - [Créer ou Mettre à Jour un Utilisateur (cu)](#créer-ou-mettre-à-jour-un-utilisateur-cu)
3. [Requêtes](#requêtes)
    - [Récupérer un Utilisateur par AuthID (ga)](#récupérer-un-utilisateur-par-authid-ga)
    - [Récupérer un Utilisateur par UserID (gu)](#récupérer-un-utilisateur-par-userid-gu)
4. [Gestion des Erreurs](#gestion-des-erreurs)

---

## 1. Importations

```typescript
import { mutation, query } from './_generated/server'
import { error, handleError } from './errors'
import { v } from 'convex/values'
```

-   **`mutation`**: Fonction pour définir des mutations dans le contexte de votre serveur
-   **`query`**: Fonction pour définir des requêtes dans le contexte de votre serveur
-   **`error`**: Un objet contenant des erreurs pré-définies pour les validations
-   **`handleError`**: Une fonction utilisée pour gérer les erreurs
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Mutations

### Créer ou Mettre à Jour un Utilisateur (cu)

```typescript
export const cu = mutation({
	args: {
		authId: v.string(),
		username: v.string()
	},
	handler: async (ctx, { authId, username }) => {
		// Logic
	}
})
```

#### Arguments

-   **`authId`**: L'ID d'authentification unique pour l'utilisateur
-   **`username`**: Le nom d'utilisateur à créer ou à mettre à jour

#### Fonctionnement

1. Valide que le `username` n'est pas vide et respecte les contraintes de longueur _(entre 2 et 20 caractères)_
2. Cherche un utilisateur existant dans la base de données via son `authId`
3. Si l'utilisateur n'existe pas, il est créé avec les informations fournies
4. Si l'utilisateur existe, son `username` est mis à jour
5. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** _(création)_ :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "USER_INFORMATIONS_CREATED",
    	"details": "The user successfully added his informations"
    }
    ```

-   **Succès** _(mise à jour)_ :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "USER_INFORMATIONS_UPDATED",
    	"details": "The user successfully updated his informations"
    }
    ```

-   **Erreurs possibles** :
    -   `error.usernameEmpty`
    -   `error.usernameTooShort`
    -   `error.usernameTooLong`

---

## 3. Requêtes

### Récupérer un Utilisateur par AuthID (ga)

```typescript
export const ga = query({
	args: {
		authId: v.string()
	},
	handler: async (ctx, { authId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`authId`**: L'ID d'authentification de l'utilisateur

#### Fonctionnement

1. Cherche un utilisateur dans la base de données via son `authId`
2. Si aucun utilisateur n'est trouvé, retourne une erreur
3. Si un utilisateur est trouvé, retourne ses informations

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "USER_RETRIEVED",
    	"details": "The user informations has been successfully retrieved",
    	"data": {
    		/* Informations de l'utilisateur */
    	}
    }
    ```

-   **Erreur** :
    -   `error.unknownUser`

---

### Récupérer un Utilisateur par UserID (gu)

```typescript
export const gu = query({
	args: {
		userId: v.string()
	},
	handler: async (ctx, { userId }) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: L'ID unique de l'utilisateur

#### Fonctionnement

1. Cherche un utilisateur dans la base de données via son `userId`
2. Si aucun utilisateur n'est trouvé, retourne une erreur
3. Si un utilisateur est trouvé, retourne ses informations

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "USER_RETRIEVED",
    	"details": "The user informations has been successfully retrieved",
    	"data": {
    		/* Informations de l'utilisateur */
    	}
    }
    ```

-   **Erreur** :
    -   `error.unknownUser`

---

## 4. Gestion des Erreurs

Les erreurs sont gérées à l'aide de la fonction `handleError`, qui capture et retourne un message d'erreur approprié selon la situation. Voici les erreurs courantes pour ce fichier :

-   **`error.usernameEmpty`**: Le nom d'utilisateur est vide
-   **`error.usernameTooShort`**: Le nom d'utilisateur est trop court _(moins de 2 caractères)_
-   **`error.usernameTooLong`**: Le nom d'utilisateur est trop long _(plus de 20 caractères)_
-   **`error.unknownUser`**: L'utilisateur n'existe pas dans la base de données
