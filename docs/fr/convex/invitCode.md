# Documentation - Gestion des Codes d'Invitation

Le module `invitCode` gère la création, l'utilisation et la gestion des codes d'invitation pour permettre aux utilisateurs de rejoindre des serveurs
Cette documentation décrit le fonctionnement de chaque fonction disponible dans le CRUD (Create, Read, Update, Delete) pour la table `invitCode`

## Table `invitCode`

### Structure

| Champ       | Type            | Description                                            |
| ----------- | --------------- | ------------------------------------------------------ |
| `serverId`  | `id('server')`  | Identifiant du serveur pour lequel le code est généré  |
| `creatorId` | `string`        | Identifiant de l'utilisateur ayant créé le code        |
| `code`      | `string`        | Code d'invitation unique généré aléatoirement          |
| `uses`      | `number`        | Nombre actuel d'utilisations du code                   |
| `maxUses`   | `number`/`null` | _(optionnel)_ Nombre maximal d'utilisations autorisées |
| `expiresAt` | `number`/`null` | _(optionnel)_ Timestamp d'expiration du code           |

### Règles de validation

-   **Code**:
    -   Doit être unique. Un code généré est vérifié pour s'assurer qu'il n'existe pas déjà dans la base de données
-   **Utilisations**:
    -   Doit être un entier positif
-   **Nombre maximal d'utilisations**:
    -   Optionnel, si spécifié, doit être un entier positif
-   **Expiration**:
    -   Optionnel, si spécifié, doit être un timestamp futur

---

## Fonctionnalités CRUD

### 1. `c` - Création d'un Code d'Invitation _(Create)_

#### Description

Crée un nouveau code d'invitation pour un serveur spécifié

#### Arguments

-   `serverId`: `id('server')` - Identifiant du serveur pour lequel le code doit être généré
-   `creatorId`: `string` - Identifiant de l'utilisateur créant le code
-   `maxUses`: `number` _(facultatif)_ - Nombre maximal d'utilisations du code. Si non spécifié, le code peut être utilisé un nombre illimité de fois
-   `expiresAt`: `number` _(facultatif)_ - Timestamp d'expiration du code. Si non spécifié, le code n'expire pas

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur et le créateur existent
    -   Vérifie que le créateur possède les permissions pour générer des invitations pour ce serveur
-   **Génération**:
    -   Génère un code unique aléatoire de 12 caractères
    -   Vérifie que le code généré n'existe pas déjà
-   **Insertion**:
    -   Insère le code généré dans la base de données avec les informations fournies

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Code created', data: codeGen }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.permissionDenied`: Permissions insuffisantes pour créer un code

---

### 2. `use` - Utilisation d'un Code d'Invitation

#### Description

Permet à un utilisateur d'utiliser un code d'invitation pour rejoindre un serveur

#### Arguments

-   `code`: `string` - Code d'invitation à utiliser
-   `userId`: `id('user')` - Identifiant de l'utilisateur utilisant le code

#### Comportement

-   **Validation**:
    -   Vérifie que le code existe
    -   Vérifie que le code n'a pas expiré
    -   Vérifie que le nombre maximal d'utilisations n'a pas été atteint
-   **Vérification du Serveur**:
    -   Vérifie que le serveur associé au code existe
-   **Ajout de Membre**:
    -   Ajoute l'utilisateur en tant que membre du serveur
-   **Mise à jour du Code**:
    -   Incrémente le nombre d'utilisations du code

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Code used' }`
-   **Errors**:
    -   `errors.invalid`: Code d'invitation inconnu
    -   `errors.expired`: Code expiré
    -   `errors.maxUsed`: Nombre maximal d'utilisations atteint
    -   `errors.serverNotFound`: Serveur non trouvé

---

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur             | Statut | Message                  | Détails supplémentaires                               |
| ------------------------- | ------ | ------------------------ | ----------------------------------------------------- |
| `errors.invalid`          | 404    | Unknown code             | Le code d'invitation spécifié n'existe pas            |
| `errors.expired`          | 400    | Code expired             | Le code d'invitation a expiré et ne peut être utilisé |
| `errors.maxUsed`          | 400    | Code usage limit reached | Le code a atteint le nombre maximal d'utilisations    |
| `errors.serverNotFound`   | 404    | Server not found         | Le serveur associé au code n'existe pas               |
| `errors.permissionDenied` | 403    | Permission denied        | L'utilisateur n'a pas les permissions nécessaires     |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
