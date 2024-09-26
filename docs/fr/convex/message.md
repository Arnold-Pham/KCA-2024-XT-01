# Gestion des Messages

Le module `message` gère la création, la lecture, la mise à jour et la suppression des messages dans les salons d'un serveur
Voici une description de chaque fonction disponible et de son fonctionnement

## Table

| Champ        | Type               | Description                                   |
| ------------ | ------------------ | --------------------------------------------- |
| `channelId`  | `id('channel')`    | ID du salon dans lequel le message est envoyé |
| `userId`     | `string`           | ID de l'utilisateur ayant envoyé le message   |
| `user`       | `string`           | Nom de l'utilisateur ayant envoyé le message  |
| `content`    | `string`           | Contenu du message                            |
| `modified`   | `boolean`          | Indique si le message a été modifié           |
| `modifiedAt` | `number` ou `null` | Timestamp de la dernière modification         |
| `deleted`    | `boolean`          | Indique si le message a été supprimé          |

## Fonctionnalités

### 1. `c` - Création d'un Message (Create)

#### Description

Crée un nouveau message dans un salon spécifié d'un serveur

#### Arguments

-   `channelId`: Identifiant du salon où le message doit être envoyé
-   `serverId`: Identifiant du serveur auquel le salon appartient
-   `userId`: Identifiant de l'utilisateur qui envoie le message
-   `user`: Nom de l'utilisateur qui envoie le message
-   `content`: Contenu du message (doit être une chaîne de caractères non vide et ne dépassant pas 3000 caractères)

#### Comportement

-   Vérifie si le contenu du message est valide (non vide et longueur maximale de 3000 caractères)
-   Vérifie si le serveur, le salon et le membre existent
-   Si toutes les conditions sont remplies, le message est inséré dans la base de données avec les informations suivantes:
    -   `channelId`, `userId`, `user`, `content`: Informations fournies par le frontend
    -   `modified`: `false` - Indique que le message n'a pas encore été modifié
    -   `modifiedAt`: `null` - Pas de date de modification initiale
    -   `deleted`: `false` - Le message n'est pas supprimé

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message sent' }`
-   **Errors**:
    -   `errors.empty`: Le contenu du message est vide
    -   `errors.tooLong`: Le contenu dépasse 3000 caractères
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`: Les informations fournies sont invalides

### 2. `l` - Lecture des Messages (List)

#### Description

Récupère une liste de messages pour un salon spécifique

#### Arguments

-   `channelId`: Identifiant du salon
-   `serverId`: Identifiant du serveur auquel le salon appartient
-   `userId`: Identifiant de l'utilisateur demandant les messages

#### Comportement

-   Vérifie si le serveur, le salon, et le membre existent
-   Récupère les 50 derniers messages du salon triés par ordre décroissant de création
-   Retourne la liste des messages dans l'ordre chronologique

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Messages collected', data: messages }`
-   **Errors**:
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`: Les informations fournies sont invalides

### 3. `u` - Mise à Jour d'un Message (Update)

#### Description

Met à jour le contenu d'un message existant

#### Arguments

-   `messageId`: Identifiant du message à mettre à jour
-   `channelId`: Identifiant du salon auquel le message appartient
-   `serverId`: Identifiant du serveur
-   `userId`: Identifiant de l'utilisateur
-   `content`: Nouveau contenu du message

#### Comportement

-   Vérifie si le contenu du message est valide (non vide et longueur maximale de 3000 caractères)
-   Vérifie si le serveur, le salon, le membre, et le message existent
-   Vérifie si l'utilisateur est l'auteur du message et/ou possède les permissions nécessaires
-   Si toutes les conditions sont remplies, le message est mis à jour avec les nouvelles informations:
    -   `content`: Nouveau contenu fourni
    -   `modified`: `true` - Le message a été modifié
    -   `modifiedAt`: Timestamp actuel

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message updated' }`
-   **Errors**:
    -   `errors.empty`: Le contenu du message est vide
    -   `errors.tooLong`: Le contenu dépasse 3000 caractères
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`, `errors.messageNotFound`: Les informations fournies sont invalides
    -   `errors.notAuthorized`: L'utilisateur n'est pas autorisé à modifier le message
    -   `errors.unchanged`: Le message n'a pas changé par rapport à l'original
    -   `errors.deleted`: Le message a déjà été supprimé

### 4. `d` - Suppression d'un Message

#### Description

Supprime (marque comme supprimé) un message existant

#### Arguments

-   `messageId`: Identifiant du message à supprimer
-   `channelId`: Identifiant du salon auquel le message appartient
-   `serverId`: Identifiant du serveur
-   `userId`: Identifiant de l'utilisateur

#### Comportement

-   Vérifie si le serveur, le salon, le membre, et le message existent
-   Vérifie si l'utilisateur est l'auteur du message ou possède les permissions nécessaires pour supprimer le message
-   Si toutes les conditions sont remplies, le message est marqué comme supprimé:
    -   `deleted`: `true`
    -   `modifiedAt`: Timestamp actuel

Le marquage comme supprimé sert à garder en mémoire les messages envoyés, mais cacher le contenu à l'affichage
L'utilisation est pour le moment ciblé modération

#### Réponses

-   **Success**: `{ status: 'success', code: 200, message: 'Message deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`, `errors.messageNotFound`: Les informations fournies sont invalides
    -   `errors.notAuthorized`: L'utilisateur n'est pas autorisé à supprimer le message
    -   `errors.deleted`: Le message a déjà été supprimé

## Gestion des Erreurs

Les fonctions utilisent un objet d'erreurs standardisé pour renvoyer des réponses cohérentes:

| Code d'Erreur            | Statut | Message                   | Détails supplémentaires                            |
| ------------------------ | ------ | ------------------------- | -------------------------------------------------- |
| `errors.deleted`         | 400    | "Action refused"          | Le message a déjà été supprimé                     |
| `errors.empty`           | 400    | "Message sending refused" | Le message est vide ou ne contient que des espaces |
| `errors.tooLong`         | 400    | "Message too long"        | Le message dépasse les 3000 caractères             |
| `errors.unchanged`       | 400    | "Message unchanged"       | Aucun changement détecté par rapport à l'original  |
| `errors.notAuthorized`   | 403    | "Action refused"          | L'utilisateur n'a pas les permissions nécessaires  |
| `errors.serverNotFound`  | 404    | "Server not found"        | Le serveur spécifié n'existe pas                   |
| `errors.memberNotFound`  | 404    | "Member not found"        | L'utilisateur n'est pas membre du serveur          |
| `errors.channelNotFound` | 404    | "Channel not found"       | Le salon spécifié n'existe pas                     |
| `errors.messageNotFound` | 404    | "Message not found"       | Le message spécifié n'existe pas                   |

Les réponses d'erreur incluent toujours un statut HTTP (`code`) et un message d'erreur clair pour faciliter le débogage et la compréhension du problème
