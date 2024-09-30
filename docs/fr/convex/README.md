# Documentation Générale de la Base de Données

[English](../../en/convex/README.md)

Ce projet utilise un schéma de base de données conçu pour gérer un système de serveurs, de membres, de rôles, de salons, de messages et de codes d'invitation. Chaque table est définie avec des champs spécifiques et des relations claires entre les entités. Cette documentation fournit un aperçu des tables et de leurs schémas respectifs.

## Tables de la Base de Données

### 1. User

Représente les utilisateurs de l'application

| Champ      | Type            | Description                                             |
| ---------- | --------------- | ------------------------------------------------------- |
| `username` | `string`        | Nom de l'utilisateur                                    |
| `picture`  | `string`/`null` | _(optionnel)_ URL de l'image de profil de l'utilisateur |
| `authId`   | `string`        | Identifiant d'authentification externe _(Auth0)_        |

### 2. Server

Représente les serveurs de l'application. Un serveur est créé par un utilisateur et peut contenir plusieurs salons et membres.

| Champ         | Type            | Description                                        |
| ------------- | --------------- | -------------------------------------------------- |
| `userId`      | `id('user')`    | ID de l'utilisateur créant le serveur              |
| `name`        | `string`        | Nom du serveur                                     |
| `ownerId`     | `string`/`null` | _(optionnel)_ ID du propriétaire actuel du serveur |
| `description` | `string`/`null` | _(optionnel)_ Description du serveur               |

### 3. InvitCode

Gère les codes d'invitation utilisés pour rejoindre des serveurs. Chaque code peut avoir une limite d'utilisation et peut expirer.

| Champ       | Type            | Description                                            |
| ----------- | --------------- | ------------------------------------------------------ |
| `serverId`  | `id('server')`  | Référence au serveur associé                           |
| `creatorId` | `string`        | ID du créateur du code d'invitation                    |
| `code`      | `string`        | Code d'invitation unique                               |
| `uses`      | `number`        | Nombre de fois que le code a été utilisé               |
| `maxUses`   | `number`/`null` | _(optionnel)_ Nombre maximum d'utilisations autorisées |
| `expiresAt` | `number`/`null` | _(optionnel)_ Timestamp de l'expiration du code        |

### 4. Member

Représente les membres des serveurs. Chaque membre est associé à un serveur et à un utilisateur.

| Champ      | Type           | Description                  |
| ---------- | -------------- | ---------------------------- |
| `serverId` | `id('server')` | Référence au serveur associé |
| `userId`   | `id('user')`   | ID de l'utilisateur          |

### 5. Channel

Définit les salons de communication au sein des serveurs. Les salons peuvent avoir différents types.

| Champ      | Type                      | Description                  |
| ---------- | ------------------------- | ---------------------------- |
| `serverId` | `id('server')`            | Référence au serveur associé |
| `name`     | `string`                  | Nom du salon                 |
| `type`     | `'text'`/`'vocal'`/`null` | _(optionnel)_ Type du salon  |

### 6. Message

Représente les messages envoyés dans les salons. Les messages peuvent être modifiés ou supprimés.

| Champ        | Type            | Description                                         |
| ------------ | --------------- | --------------------------------------------------- |
| `channelId`  | `id('channel')` | Référence au salon associé                          |
| `userId`     | `id('user')`    | ID de l'utilisateur ayant envoyé le message         |
| `content`    | `string`        | Contenu du message                                  |
| `modified`   | `boolean`       | Indique si le message a été modifié                 |
| `modifiedAt` | `number`/`null` | _(optionnel)_ Timestamp de la dernière modification |
| `deleted`    | `boolean`       | Indique si le message a été supprimé                |
