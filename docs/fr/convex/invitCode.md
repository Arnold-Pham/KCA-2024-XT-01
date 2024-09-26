# Gestion des Codes d'Invitation

Le module `invitCode` gère la création et l'utilisation des codes d'invitation pour les serveurs
Il permet de générer des codes uniques qui peuvent être utilisés pour rejoindre un serveur

## Table

| Champ       | Type               | Description                                              |
| ----------- | ------------------ | -------------------------------------------------------- |
| `serverId`  | `id` ('server')    | ID du serveur auquel le code d'invitation est lié        |
| `creatorId` | `string`           | ID du créateur du code d'invitation                      |
| `code`      | `string`           | Code d'invitation unique                                 |
| `uses`      | `number`           | Nombre de fois que le code a été utilisé                 |
| `maxUses`   | `number` ou `null` | Limite maximale d'utilisation du code (peut être `null`) |
| `expiresAt` | `number` ou `null` | Timestamp de l'expiration du code (peut être `null`)     |

## Fonctionnalités

### 1. `c` - Création d'un Code d'Invitation (Create)

#### Description

Génère un nouveau code d'invitation pour un serveur spécifié

#### Arguments

-   `serverId`: Identifiant du serveur pour lequel le code d'invitation est généré
-   `creatorId`: Identifiant de l'utilisateur créant le code
-   `maxUses`: (Optionnel) Limite du nombre d'utilisations du code. Par défaut, aucune limite
-   `expiresAt`: (Optionnel) Timestamp de l'expiration du code. Par défaut, pas de date d'expiration

#### Comportement

-   Génération de Code:
    -   Utilise la fonction `generateCode` pour créer un code unique de 12 caractères (par défaut)
    -   Le code est vérifié pour s'assurer qu'il n'existe pas déjà dans la base de données
-   Insertion dans la Base de Données:
    -   Le code généré est stocké dans la table invitCode avec les informations fournies:
        -   `serverId`, `creatorId`: Données fournies par le frontend
        -   `code`: Code généré de manière unique
        -   `uses`: Initialisé à 0
        -   `maxUses`: Peut être `null` ou le nombre maximal d'utilisations
        -   `expiresAt`: Peut être `null` ou le timestamp d'expiration

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Code created', data: codeGen }`
-   **Errors**:
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas

### 2. `use` - Utilisation d'un Code d'Invitation (Use)

#### Description

Permet à un utilisateur d'utiliser un code d'invitation pour rejoindre un serveur

#### Arguments

`code`: Code d'invitation à utiliser
`userId`: Identifiant de l'utilisateur qui utilise le code
`user`: Nom de l'utilisateur

#### Comportement

-   Vérification du Code:
    -   Le code d'invitation est recherché dans la table `invitCode`
    -   Si le code n'existe pas, retourne l'erreur `errors.invalid`
    -   Si le code a expiré, retourne l'erreur `errors.expired`
    -   Si le nombre maximal d'utilisations est atteint, retourne l'erreur `errors.maxUsed`
-   Vérification du Serveur:
    -   Vérifie que le serveur associé au code existe
    -   Si le serveur n'existe pas, retourne l'erreur `errors.serverNotFound`
-   Ajout du Membre:
    -   L'utilisateur est ajouté en tant que membre du serveur dans la table `member`
    -   Le compteur `uses` du code d'invitation est incrémenté de 1
-   Mise à jour du Code:
    -   Incrémente le champ `uses` du code d'invitation

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Code used' }`
-   **Errors**:
    -   `errors.invalid`: Le code d'invitation n'est pas valide
    -   `errors.maxUsed`: La limite d'utilisation du code est atteinte
    -   `errors.serverNotFound`: Le serveur spécifié n'existe pas
    -   `errors.expired`: Le code a expiré

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur           | Statut | Message                    | Détails supplémentaires                      |
| ----------------------- | ------ | -------------------------- | -------------------------------------------- |
| `errors.invalid`        | 404    | "Unknown code"             | Le code d'invitation est inconnu             |
| `errors.maxUsed`        | 400    | "Code usage limit reached" | La limite d'utilisation du code est atteinte |
| `errors.serverNotFound` | 404    | "Server not found"         | Le serveur spécifié n'existe pas             |
| `errors.expired`        | 400    | "Code expired"             | Le code a expiré                             |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème.
