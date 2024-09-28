# Documentation - Gestion des Messages

Le module `message` gère l'envoi, la consultation, la modification et la suppression de messages dans les canaux (`channel`) d'un serveur
Cette documentation décrit le fonctionnement de chaque fonction disponible dans le CRUD (Create, Read, Update, Delete) pour la table `message`

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

### Règles de validation

-   **Contenu**:
    -   Ne doit pas être vide
    -   La longueur maximale est de 3000 caractères
-   **Auteur**:
    -   Un message doit être lié à un membre du serveur
    -   Seul l'auteur du message ou un modérateur peut le modifier ou le supprimer

---

## Fonctionnalités CRUD

### 1. `c` - Envoi d'un Message _(Create)_

#### Description

Ajoute un nouveau message dans un canal spécifié d'un serveur

#### Arguments

-   `channelId`: `id('channel')` - Identifiant du canal où le message sera posté
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `userId`: `id('user')` - Identifiant de l'utilisateur envoyant le message
-   `content`: `string` - Contenu du message

#### Comportement

-   **Validation**:
    -   Vérifie que le contenu n'est pas vide et ne dépasse pas 3000 caractères
    -   Vérifie que le serveur, le membre et le canal existent
-   **Insertion**:
    -   Si toutes les vérifications passent, insère le message dans la table `message` avec les informations fournies

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message sent' }`
-   **Errors**:
    -   `errors.empty`: Le contenu du message est vide
    -   `errors.tooLong`: Le contenu du message dépasse 3000 caractères
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé
    -   `errors.channelNotFound`: Canal non trouvé

---

### 2. `l` - Consultation des Messages _(List)_

#### Description

Récupère la liste des messages d'un canal spécifié d'un serveur
Par défaut, retourne les 50 derniers messages

#### Arguments

-   `channelId`: `id('channel')` - Identifiant du canal dont les messages doivent être récupérés
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `userId`: `string` - Identifiant de l'utilisateur demandant les messages

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur, le membre et le canal existent
-   **Récupération**:
    -   Si toutes les vérifications passent, récupère les 50 derniers messages du canal spécifié, triés par ordre chronologique inverse

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Messages collected', data: messages.reverse() }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé
    -   `errors.channelNotFound`: Canal non trouvé

---

### 3. `u` - Modification d'un Message _(Update)_

#### Description

Modifie le contenu d'un message existant dans un canal d'un serveur

#### Arguments

-   `messageId`: `id('message')` - Identifiant du message à modifier
-   `channelId`: `id('channel')` - Identifiant du canal contenant le message
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `userId`: `string` - Identifiant de l'utilisateur modifiant le message
-   `content`: `string` - Nouveau contenu du message

#### Comportement

-   **Validation**:
    -   Vérifie que le contenu n'est pas vide et ne dépasse pas 3000 caractères
    -   Vérifie que le serveur, le membre, le canal et le message existent
    -   Vérifie que le message n'est pas déjà supprimé
    -   Seul l'auteur du message ou un modérateur peut le modifier
-   **Modification**:
    -   Si toutes les vérifications passent, met à jour le contenu du message et indique qu'il a été modifié (`modified: true`, `modifiedAt: Date.now()`)

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message updated' }`
-   **Errors**:
    -   `errors.empty`: Le contenu du message est vide
    -   `errors.tooLong`: Le contenu du message dépasse 3000 caractères
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé
    -   `errors.channelNotFound`: Canal non trouvé
    -   `errors.messageNotFound`: Message non trouvé
    -   `errors.deleted`: Le message a déjà été supprimé
    -   `errors.notAuthorized`: Action non autorisée, permissions insuffisantes
    -   `errors.unchanged`: Le contenu du message est inchangé

---

### 4. `d` - Suppression d'un Message _(Delete)_

#### Description

Supprime un message existant dans un canal d'un serveur

#### Arguments

-   `messageId`: `id('message')` - Identifiant du message à supprimer
-   `channelId`: `id('channel')` - Identifiant du canal contenant le message
-   `serverId`: `id('server')` - Identifiant du serveur auquel le canal appartient
-   `userId`: `string` - Identifiant de l'utilisateur demandant la suppression

#### Comportement

-   **Validation**:
    -   Vérifie que le serveur, le membre, le canal et le message existent
    -   Vérifie que le message n'est pas déjà supprimé
    -   Seul l'auteur du message ou un modérateur peut le supprimer
-   **Suppression**:
    -   Si toutes les vérifications passent, marque le message comme supprimé (`deleted: true`)

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`: Serveur non trouvé
    -   `errors.memberNotFound`: Membre non trouvé
    -   `errors.channelNotFound`: Canal non trouvé
    -   `errors.messageNotFound`: Message non trouvé
    -   `errors.deleted`: Le message a déjà été supprimé
    -   `errors.notAuthorized`: Action non autorisée, permissions insuffisantes

---

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur            | Statut | Message                 | Détails supplémentaires                           |
| ------------------------ | ------ | ----------------------- | ------------------------------------------------- |
| `errors.deleted`         | 400    | Action refused          | Le message a déjà été supprimé                    |
| `errors.empty`           | 400    | Message sending refused | Le contenu du message est vide                    |
| `errors.tooLong`         | 400    | Message too long        | Le contenu du message dépasse 3000 caractères     |
| `errors.unchanged`       | 400    | Message unchanged       | Le contenu du message est inchangé                |
| `errors.notAuthorized`   | 403    | Action refused          | L'utilisateur n'a pas les permissions nécessaires |
| `errors.serverNotFound`  | 404    | Server not found        | Le serveur spécifié n'existe pas                  |
| `errors.memberNotFound`  | 404    | Member not found        | Le membre spécifié n'existe pas dans le serveur   |
| `errors.channelNotFound` | 404    | Channel not found       | Le canal spécifié n'existe pas                    |
| `errors.messageNotFound` | 404    | Message not found       | Le message spécifié n'existe pas                  |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
