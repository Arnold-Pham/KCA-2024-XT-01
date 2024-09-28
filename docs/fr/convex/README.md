# Documentation Générale de la Base de Données

[Français](README.md) | [English](../../en/convex/README.md)

Ce projet utilise un schéma de base de données conçu pour gérer un système de serveurs, de membres, de rôles, de canaux, de messages et de codes d'invitation
Chaque table est définie avec des champs spécifiques et des relations claires entre les entités
Cette documentation fournit un aperçu des tables et de leurs schémas respectifs

## Tables de la Base de Données

### 1. Server

Représente les serveurs de l'application
Un serveur est créé par un utilisateur et peut contenir plusieurs canaux et membres

| Champ         | Type         | Description                                         |
| ------------- | ------------ | --------------------------------------------------- |
| `userId`      | `id('user')` | ID de l'utilisateur créant le serveur               |
| `name`        | `string`     | Nom du serveur                                      |
| `ownerId`     | `string`     | _(optionnel)_ ID du propriétaire actuel du serveur  |
| `owner`       | `string`     | _(optionnel)_ Nom du propriétaire actuel du serveur |
| `description` | `string`     | _(optionnel)_ Description du serveur                |

### 2. [InvitCode](invitCode.md)

Gère les codes d'invitation utilisés pour rejoindre des serveurs
Chaque code a une limite d'utilisation et peut expirer

| Champ       | Type           | Description                                            |
| ----------- | -------------- | ------------------------------------------------------ |
| `serverId`  | `id('server')` | Référence au serveur associé                           |
| `creatorId` | `string`       | ID du créateur du code d'invitation                    |
| `code`      | `string`       | Code d'invitation unique                               |
| `uses`      | `number`       | Nombre de fois que le code a été utilisé               |
| `maxUses`   | `number`       | _(optionnel)_ Nombre maximum d'utilisations autorisées |
| `expiresAt` | `number`       | _(optionnel)_ Timestamp de l'expiration du code        |

### 3. Role

Décrit les rôles associés à chaque serveur
Les rôles ont des permissions spécifiques qui contrôlent les actions autorisées

| Champ         | Type           | Description                                       |
| ------------- | -------------- | ------------------------------------------------- |
| `serverId`    | `id('server')` | Référence au serveur associé                      |
| `name`        | `string`       | Nom du rôle                                       |
| `permissions` | `object`       | Permissions associées au rôle _(voir ci-dessous)_ |
| `createdBy`   | `string`       | ID de l'utilisateur ayant créé le rôle            |

#### Permissions:

-   `createChannel`: Créer des canaux
-   `deleteChannel`: Supprimer des canaux
-   `updateChannel`: Mettre à jour des canaux
-   `manageRoles`: Gérer les rôles des membres
-   `sendMessage`: Envoyer des messages dans les canaux
-   `deleteMessage`: Supprimer des messages

### 4. [Member](member.md)

Représente les membres des serveurs
Chaque membre peut avoir un rôle associé

| Champ      | Type           | Description                          |
| ---------- | -------------- | ------------------------------------ |
| `serverId` | `id('server')` | Référence au serveur associé         |
| `userId`   | `id('user')`   | ID de l'utilisateur                  |
| `role`     | `id('role')`   | _(optionnel)_ Rôle associé au membre |

### 5. [Channel](channel.md)

Définit les canaux de communication au sein des serveurs
Les canaux peuvent avoir différents types et permissions

| Champ         | Type           | Description                                     |
| ------------- | -------------- | ----------------------------------------------- |
| `serverId`    | `id('server')` | Référence au serveur associé                    |
| `name`        | `string`       | Nom du canal                                    |
| `type`        | `string`       | _(optionnel)_ Type du canal (ex: textuel/vocal) |
| `permissions` | `string`       | _(optionnel)_ Permissions spécifiques du canal  |

### 6. [Message](message.md)

Représente les messages envoyés dans les canaux
Les messages peuvent être modifiés ou supprimés

| Champ        | Type            | Description                                 |
| ------------ | --------------- | ------------------------------------------- |
| `channelId`  | `id('channel')` | Référence au canal associé                  |
| `userId`     | `id('user')`    | ID de l'utilisateur ayant envoyé le message |
| `content`    | `string`        | Contenu du message                          |
| `modified`   | `boolean`       | Indique si le message a été modifié         |
| `modifiedAt` | `number`/`null` | Timestamp de la dernière modification       |
| `deleted`    | `boolean`       | Indique si le message a été supprimé        |

### 7. User

Représente les utilisateurs de l'application

| Champ      | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| `userId`   | `string` | ID de l'utilisateur, unique pour chaque utilisateur |
| `userName` | `string` | Nom de l'utilisateur                                |
| `picture`  | `string` | URL de l'image de profil de l'utilisateur           |

## Navigation

Pour plus de détails sur chaque table, cliquez sur les liens ci-dessous pour accéder à la documentation spécifique:

-   Server
-   [InvitCode](invitCode.md)
-   Role
-   [Member](member.md)
-   [Channel](channel.md)
-   [Message](message.md)
-   User

Chaque documentation de table fournit des informations détaillées sur les champs, les contraintes, et les relations avec d'autres entités du schéma
