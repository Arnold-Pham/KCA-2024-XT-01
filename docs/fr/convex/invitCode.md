# Documentation du Fichier `invitCode.tsx`

Ce fichier contient les définitions des mutations pour gérer la création et l'utilisation des codes d'invitation. Les fonctions incluent des validations pour garantir le bon fonctionnement des opérations.

## Table des Matières

1. [Importations](#importations)
2. [Fonctions Utilitaires](#fonctions-utilitaires)
    - [Générer un Code (generateCode)](#generer-un-code-generateCode)
3. [Mutations](#mutations)
    - [Créer un Code d'Invitation (c)](#creer-un-code-dinvitation-c)
    - [Utiliser un Code d'Invitation (use)](#utiliser-un-code-dinvitation-use)
4. [Gestion des Erreurs](#gestion-des-erreurs)

---

## 1. Importations

```typescript
import { error, handleError, verifyUSMC } from './errors'
import { MutationCtx } from './_generated/server'
import { mutation } from './_generated/server'
import { v } from 'convex/values'
```

-   **`error`**: Un objet contenant diverses erreurs pré-définies pour les validations
-   **`handleError`**: Une fonction utilisée pour gérer les erreurs d'appels à convex
-   **`verifyUSMC`**: Une fonction pour valider l'utilisateur, le serveur et vérifier si l'utilisateur est membre du serveur
-   **`MutationCtx`**: Type contextuel utilisé pour les mutations
-   **`mutation`**: Fonction pour définir des mutations dans le contexte de votre serveur
-   **`v`**: Utilisé pour valider les types des arguments

---

## 2. Fonctions Utilitaires

### Générer un Code (generateCode)

```typescript
const generateCode = async (ctx: MutationCtx, length: number = 12): Promise<string> => {
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
	let code = ''

	while (true) {
		for (let i = 0; i < length; i++) code += charset[Math.floor(Math.random() * charset.length)]

		const existingCode = await ctx.db
			.query('invitCode')
			.filter(q => q.eq('code', code))
			.first()
		if (!existingCode) return code
	}
}
```

#### Arguments

-   **`ctx`**: Contexte de mutation qui contient des informations sur la base de données
-   **`length`**: Longueur du code à générer _(par défaut: 12)_

#### Fonctionnement

1. Définit un ensemble de caractères _(lettres majuscules et chiffres)_ à partir duquel le code sera généré
2. Utilise une boucle infinie pour générer un code aléatoire de la longueur spécifiée
3. Vérifie si le code généré existe déjà dans la base de données
4. Si le code existe, le processus recommence jusqu'à obtenir un code unique

#### Retourne

-   Un code d'invitation unique de la longueur spécifiée

---

## 3. Mutations

### Créer un Code d'Invitation (c)

```typescript
export const c = mutation({
	args: {
		creatorId: v.id('user'),
		serverId: v.id('server'),
		maxUses: v.optional(v.union(v.number(), v.null())),
		expiresAt: v.optional(v.union(v.number(), v.null()))
	},
	handler: async (ctx, { creatorId, serverId, maxUses, expiresAt }) => {
		// Logic
	}
})
```

#### Arguments

-   **`creatorId`**: ID de l'utilisateur qui crée le code d'invitation _(doit être un identifiant valide de type `user`)_
-   **`serverId`**: ID du serveur pour lequel le code est créé _(doit être un identifiant valide de type `server`)_
-   **`maxUses`** _(optionnel)_: Nombre maximal d'utilisations du code _(peut être un nombre ou `null`)_
-   **`expiresAt`** _(optionnel)_: Timestamp indiquant la date d'expiration du code _(peut être un nombre ou `null`)_

#### Fonctionnement

1. Utilise `verifyUSMC` pour valider l'utilisateur et le serveur
2. Génère un code d'invitation unique en appelant `generateCode`
3. Insère le code d'invitation dans la base de données avec les détails fournis
4. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CODE_CREATED",
    	"details": "The invitation code has been successfully created",
    	"data": // Le code généré
    }
    ```

-   **Erreurs possibles** :
    -   `error.userNotMember`

---

### Utiliser un Code d'Invitation (use)

```typescript
export const use = mutation({
	args: {
		userId: v.id('user'),
		code: v.string()
	},
	handler: async (ctx, args) => {
		// Logic
	}
})
```

#### Arguments

-   **`userId`**: ID de l'utilisateur qui souhaite utiliser le code _(doit être un identifiant valide de type `user`)_
-   **`code`**: Code d'invitation à utiliser _(doit être une chaîne de caractères)_

#### Fonctionnement

1. Recherche le code d'invitation dans la base de données
2. Vérifie si le code existe
3. Vérifie si le code a expiré ou si le nombre maximal d'utilisations a été atteint
4. Utilise `verifyUSMC` pour valider l'utilisateur par rapport au serveur associé au code
5. Insère l'utilisateur en tant que membre dans le serveur
6. Met à jour le nombre d'utilisations du code d'invitation
7. Retourne un message de succès ou une erreur appropriée

#### Réponse

-   **Succès** :

    ```json
    {
    	"status": "success",
    	"code": 200,
    	"message": "CODE_USED",
    	"details": "The invitation code has been successfully used"
    }
    ```

-   **Erreurs possibles** :
    -   `error.inviteCodeInvalid`
    -   `error.inviteCodeExpired`
    -   `error.inviteCodeMaxUsesExceeded`
    -   `error.userNotMember`

---

## 4. Gestion des Erreurs

Chaque mutation utilise la fonction `handleError` pour capturer et gérer les exceptions. Les erreurs peuvent inclure des problèmes de validation, des erreurs d'accès ou des erreurs inattendues. Les réponses en cas d'erreur contiendront un statut, un code et un message explicite pour faciliter le débogage.
