# General Database Documentation

[Français](../../fr/convex/README.md)

This project utilizes a database schema designed to manage a system of servers, members, roles, channels, messages, and invitation codes. Each table is defined with specific fields and clear relationships between entities. This documentation provides an overview of the tables and their respective schemas.

## Database Tables

### 1. User

Represents the users of the application.

| Field      | Type            | Description                                    |
| ---------- | --------------- | ---------------------------------------------- |
| `username` | `string`        | The username of the user                       |
| `picture`  | `string`/`null` | _(optional)_ URL of the user's profile picture |
| `authId`   | `string`        | External authentication identifier _(Auth0)_   |

### 2. Server

Represents the servers of the application. A server is created by a user and can contain multiple channels and members.

| Field         | Type            | Description                                        |
| ------------- | --------------- | -------------------------------------------------- |
| `userId`      | `id('user')`    | ID of the user creating the server                 |
| `name`        | `string`        | Name of the server                                 |
| `ownerId`     | `string`/`null` | _(optional)_ ID of the current owner of the server |
| `description` | `string`/`null` | _(optional)_ Description of the server             |

### 3. InviteCode

Manages invitation codes used to join servers. Each code can have a usage limit and may expire.

| Field       | Type            | Description                                     |
| ----------- | --------------- | ----------------------------------------------- |
| `serverId`  | `id('server')`  | Reference to the associated server              |
| `creatorId` | `string`        | ID of the creator of the invitation code        |
| `code`      | `string`        | Unique invitation code                          |
| `uses`      | `number`        | Number of times the code has been used          |
| `maxUses`   | `number`/`null` | _(optional)_ Maximum number of allowed uses     |
| `expiresAt` | `number`/`null` | _(optional)_ Timestamp of when the code expires |

### 4. Member

Represents the members of servers. Each member is associated with a server and a user.

| Field      | Type           | Description                        |
| ---------- | -------------- | ---------------------------------- |
| `serverId` | `id('server')` | Reference to the associated server |
| `userId`   | `id('user')`   | ID of the user                     |

### 5. Channel

Defines communication channels within servers. Channels can have different types.

| Field      | Type                      | Description                        |
| ---------- | ------------------------- | ---------------------------------- |
| `serverId` | `id('server')`            | Reference to the associated server |
| `name`     | `string`                  | Name of the channel                |
| `type`     | `'text'`/`'voice'`/`null` | _(optional)_ Type of the channel   |

### 6. Message

Represents messages sent in channels. Messages can be modified or deleted.

| Field        | Type            | Description                                     |
| ------------ | --------------- | ----------------------------------------------- |
| `channelId`  | `id('channel')` | Reference to the associated channel             |
| `userId`     | `id('user')`    | ID of the user who sent the message             |
| `content`    | `string`        | Content of the message                          |
| `modified`   | `boolean`       | Indicates if the message has been modified      |
| `modifiedAt` | `number`/`null` | _(optional)_ Timestamp of the last modification |
| `deleted`    | `boolean`       | Indicates if the message has been deleted       |
