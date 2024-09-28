# Documentation - Gestion des Messages

Le module `message` permet la gestion des messages dans les canaux (`channel`) d'un serveur. Il propose des fonctionnalités CRUD (Create, Read, Update, Delete) pour la table `message`.

## Table `message`

### Structure

| Champ        | Type            | Description                                                  |
| ------------ | --------------- | ------------------------------------------------------------ |
| `channelId`  | `id('channel')` | Identifiant du canal où le message est posté                 |
| `userId`     | `id('user')`    | Identifiant de l'utilisateur ayant envoyé le message         |
| `content`    | `string`        | Contenu du message                                           |
| `modified`   | `boolean`       | Indique si le message a été modifié                          |
| `modifiedAt` | `number`/`null` | Timestamp de la dernière modification, `null` si non modifié |
| `deleted`    | `boolean`       | Indique si le message a été supprimé                         |

### Règles de Validation

-   **Contenu**:
    -   Ne doit pas être vide
    -   La longueur maximale est de 3000 caractères
-   **Auteur**:
    -   Un message doit être lié à un utilisateur membre du serveur
    -   Seul l'auteur du message ou un modérateur peut le modifier ou le supprimer

---

## Fonctionnalités CRUD

### 1. `c` - Envoi d'un Message _(Create)_

#### Description

Ajoute un nouveau message dans un canal spécifié d'un serveur

#### Arguments

-   `userId`: `id('user')` - Identifiant de l'utilisateur envoyant le message
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `channelId`: `id('channel')` - Identifiant du canal où le message sera posté
-   `content`: `string` - Contenu du message

#### Comportement

-   **Validation**:
    -   Vérifie que le contenu n'est pas vide et ne dépasse pas 3000 caractères
    -   Vérifie que l'utilisateur, le serveur et le canal existent
-   **Insertion**:
    -   Si toutes les vérifications passent, insère le message dans la table `message` avec les informations fournies

#### Réponses

-   **Success**:

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGE_SENT',
        details: 'Le message a bien été envoyé'
    }
    ```

-   **Erreurs**:
    -   `messageEmpty`: Le contenu du message est vide
    -   `messageTooLong`: Le contenu du message dépasse 3000 caractères
    -   `unknownUser`: Utilisateur non trouvé
    -   `unknownServer`: Serveur non trouvé
    -   `unknownChannel`: Canal non trouvé

---

### 2. `l` - Consultation des Messages _(List)_

#### Description

Récupère la liste des messages d'un canal spécifié d'un serveur
Par défaut, retourne les 50 derniers messages

#### Arguments

-   `userId`: `id('user')` - Identifiant de l'utilisateur demandant les messages
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `channelId`: `id('channel')` - Identifiant du canal dont les messages doivent être récupérés

#### Comportement

-   **Validation**:
    -   Vérifie que l'utilisateur, le serveur et le canal existent
-   **Récupération**:
    -   Si toutes les vérifications passent, récupère les 50 derniers messages du canal spécifié, triés par ordre chronologique inverse

#### Réponses

-   **Success**: Avec `messagesWithName` qui représente la jointure entre `user` et `message`

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGES_GATHERED',
        details: 'Les cinquante derniers messages ont été récupérés',
        data: messagesWithName.reverse()
    }
    ```

-   **Erreurs**:
    -   `unknownUser`: Utilisateur non trouvé
    -   `unknownServer`: Serveur non trouvé
    -   `unknownChannel`: Canal non trouvé

---

### 3. `u` - Modification d'un Message _(Update)_

#### Description

Modifie le contenu d'un message existant dans un canal d'un serveur

#### Arguments

-   `userId`: `id('user')` - Identifiant de l'utilisateur modifiant le message
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `channelId`: `id('channel')` - Identifiant du canal contenant le message
-   `messageId`: `id('message')` - Identifiant du message à modifier
-   `content`: `string` - Nouveau contenu du message

#### Comportement

-   **Validation**:
    -   Vérifie que le contenu n'est pas vide et ne dépasse pas 3000 caractères
    -   Vérifie que l'utilisateur, le serveur, le canal et le message existent
    -   Vérifie que le message n'est pas déjà supprimé
    -   Seul l'auteur du message ou un modérateur peut le modifier
-   **Modification**:
    -   Si toutes les vérifications passent, met à jour le contenu du message et indique qu'il a été modifié (`modified: true`, `modifiedAt: Date.now()`)

#### Réponses

-   **Success**:

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGE_UPDATED',
        details: 'Le message a bien été mis à jour'
    }
    ```

-   **Erreurs**:
    -   `messageEmpty`: Le contenu du message est vide
    -   `messageTooLong`: Le contenu du message dépasse 3000 caractères
    -   `unknownUser`: Utilisateur non trouvé
    -   `unknownServer`: Serveur non trouvé
    -   `unknownChannel`: Canal non trouvé
    -   `unknownMessage`: Message non trouvé
    -   `messageDeleted`: Le message a déjà été supprimé
    -   `messageNotAuthor`: Seul l'auteur du message peut le modifier
    -   `messageUnchanged`: Le contenu du message est inchangé

---

### 4. `d` - Suppression d'un Message _(Delete)_

#### Description

Supprime un message existant dans un canal d'un serveur

#### Arguments

-   `userId`: `id('user')` - Identifiant de l'utilisateur demandant la suppression
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `channelId`: `id('channel')` - Identifiant du canal contenant le message
-   `messageId`: `id('message')` - Identifiant du message à supprimer

#### Comportement

-   **Validation**:
    -   Vérifie que l'utilisateur, le serveur, le canal et le message existent
    -   Vérifie que le message n'est pas déjà supprimé
    -   Seul l'auteur du message ou un modérateur peut le supprimer
-   **Suppression**:
    -   Si toutes les vérifications passent, marque le message comme supprimé (`deleted: true`)

#### Réponses

-   **Success**:

    ```javascript
    {
    	status: 'success',
    	code: 200,
    	message: 'MESSAGE_DELETED',
    	details: 'Le message a bien été supprimé'
    }
    ```

-   **Erreurs**:
    -   `unknownUser`: Utilisateur non trouvé
    -   `unknownServer`: Serveur non trouvé
    -   `unknownChannel`: Canal non trouvé
    -   `unknownMessage`: Message non trouvé
    -   `messageDeleted`: Le message a déjà été supprimé
    -   `messageNotAuthor`: Seul l'auteur du message peut le supprimer

---

## Fonctions Utilitaires - Gestion des Erreurs et Vérification des Données

Les fonctions `handleError` et `verifyUserServerChannel` sont des utilitaires essentiels qui facilitent la gestion des erreurs et la vérification des entités utilisateur, serveur et canal avant d'exécuter les mutations ou les requêtes. Elles ne sont pas directement associées à des opérations CRUD, mais elles jouent un rôle crucial dans le bon fonctionnement de celles-ci.

### 1. `handleError` - Gestion des Erreurs

#### Description

La fonction `handleError` centralise la gestion des erreurs en renvoyant un objet d'erreur formaté avec les informations appropriées. Cette fonction est utilisée pour intercepter les exceptions survenant lors des mutations et des requêtes et pour renvoyer un message d'erreur standardisé.

#### Signature

```typescript
function handleError(error: unknown)
```

#### Comportement

-   La fonction vérifie si l'erreur capturée est une instance de `Error`
-   Si c'est le cas, elle lève une nouvelle erreur avec les détails de l'erreur d'origine, en utilisant le format suivant:
    ```javascript
    {
        status: 'error',
        code: 500,
        message: 'SERVER_ERROR',
        details: error.message || 'Server Error'
    }
    ```
-   Si ce n'est pas une instance de `Error`, elle renvoie un objet d'erreur générique:
    ```javascript
    {
        status: 'error',
        code: 500,
        message: 'UNKNOWN_ERROR',
        details: String(error)
    }
    ```
-   La fonction relance toujours une erreur (`throw`), ce qui signifie qu'elle interrompt le flux d'exécution normal

#### Exemple d'Utilisation

Cette fonction est appelée dans les `try/catch` des mutations et des requêtes pour capturer les exceptions et renvoyer des erreurs formatées de manière uniforme

```typescript
try {
	// Code susceptible de provoquer une erreur
} catch (error: unknown) {
	return handleError(error)
}
```

---

### 2. `verifyUserServerChannel` - Vérification des Entités

#### Description

La fonction `verifyUserServerChannel` vérifie que l'utilisateur, le serveur, le membre et le canal associés à une opération existent bien dans la base de données. Cette vérification est nécessaire avant toute modification ou consultation des messages pour garantir la validité des entités impliquées.

#### Signature

```typescript
async function verifyUserServerChannel(
	ctx: MutationCtx | QueryCtx,
	{ userId, serverId, channelId }: { userId: Id<'user'>; serverId: Id<'server'>; channelId: Id<'channel'> }
)
```

#### Arguments

-   `ctx`: Contexte de la mutation ou de la requête (`MutationCtx | QueryCtx`)
-   `{ userId, serverId, channelId }`: Objet contenant les identifiants de l'utilisateur (`userId`), du serveur (`serverId`) et du canal (`channelId`) à vérifier

#### Comportement

1. **Vérification de l'Utilisateur**:

    - Recherche l'utilisateur dans la table `user` en utilisant `userId`
    - Si l'utilisateur n'est pas trouvé, renvoie une erreur `unknownUser`:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_USER',
        	details: 'The specified user could not be found in the database'
        }
        ```

2. **Vérification du Serveur**:

    - Recherche le serveur dans la table `server` en utilisant `serverId`
    - Si le serveur n'est pas trouvé, renvoie une erreur `unknownServer`:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_SERVER',
        	details: 'The specified server could not be found in the list of available servers'
        }
        ```

3. **Vérification du Membre**:

    - Vérifie que l'utilisateur est bien membre du serveur dans la table `member`
    - Si le membre n'est pas trouvé, renvoie une erreur `unknownMember`:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_MEMBER',
        	details: 'The specified member is not part of the server'
        }
        ```

4. **Vérification du Canal**:

    - Recherche le canal dans la table `channel` en utilisant `channelId`
    - Si le canal n'est pas trouvé, renvoie une erreur `unknownChannel`:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_CHANNEL',
        	details: 'The specified channel could not be found in the server'
        }
        ```

5. **Retour**:
    - Si toutes les vérifications passent, la fonction renvoie `null`, signifiant que toutes les entités sont valides

#### Exemple d'Utilisation

Cette fonction est appelée au début des mutations et des requêtes pour s'assurer que les entités impliquées existent

```typescript
const validationError = await verifyUserServerChannel(ctx, args)
if (validationError) return validationError
```

Cela permet de stopper l'exécution de l'opération en cas de problème et d'éviter des erreurs de logique ou des accès non autorisés

---

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur      | Statut | Message            | Détails Supplémentaires                                                   |
| ------------------ | ------ | ------------------ | ------------------------------------------------------------------------- |
| `unknownUser`      | 404    | UNKNOWN_USER       | The specified user could not be found in the database                     |
| `unknownServer`    | 404    | UNKNOWN_SERVER     | The specified server could not be found in the list of available servers  |
| `unknownMember`    | 404    | UNKNOWN_MEMBER     | The specified member is not part of the server                            |
| `unknownChannel`   | 404    | UNKNOWN_CHANNEL    | The specified channel could not be found in the server                    |
| `unknownMessage`   | 404    | UNKNOWN_MESSAGE    | The specified message could not be found in the channel                   |
| `messageEmpty`     | 400    | MESSAGE_EMPTY      | The message content must contain at least one character                   |
| `messageTooLong`   | 400    | MESSAGE_TOO_LONG   | The message exceeds the allowed character limit                           |
| `messageDeleted`   | 410    | MESSAGE_DELETED    | The specified message has already been deleted and is no longer available |
| `messageNotAuthor` | 403    | MESSAGE_NOT_AUTHOR | Only the author of the message can perform this action                    |
| `messageUnchanged` | 400    | MESSAGE_UNCHANGED  | The new message content must be different from the original               |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
