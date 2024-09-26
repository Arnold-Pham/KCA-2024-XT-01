# General Database Documentation

[Français](../../fr/convex/README.md) | [English](README.md)

This project uses a database schema designed to manage a system of servers, members, roles, channels, messages, and invitation codes. Each table is defined with specific fields and clear relationships between entities. This documentation provides an overview of the tables and their respective schemas.

## Database Tables

### 1. Server

Represents the servers within the application. A server is created by a user and can contain multiple channels and members.

| Field         | Type     | Description                                        |
| ------------- | -------- | -------------------------------------------------- |
| `userId`      | `string` | ID of the user creating the server                 |
| `user`        | `string` | Name of the user creating the server               |
| `name`        | `string` | Name of the server                                 |
| `ownerId`     | `string` | (optional) ID of the current owner of the server   |
| `owner`       | `string` | (optional) Name of the current owner of the server |
| `description` | `string` | (optional) Description of the server               |

### 2. [InvitCode](invitCode.md)

Manages the invitation codes used to join servers. Each code has a usage limit and may expire.

| Field       | Type            | Description                                 |
| ----------- | --------------- | ------------------------------------------- |
| `serverId`  | `id` ('server') | Reference to the associated server          |
| `creatorId` | `string`        | ID of the creator of the invitation code    |
| `code`      | `string`        | Unique invitation code                      |
| `uses`      | `number`        | Number of times the code has been used      |
| `maxUses`   | `number`        | (optional) Maximum number of allowed uses   |
| `expiresAt` | `number`        | (optional) Expiration timestamp of the code |

### 3. Role

Describes the roles associated with each server. Roles have specific permissions that control allowed actions.

| Field         | Type            | Description                                      |
| ------------- | --------------- | ------------------------------------------------ |
| `serverId`    | `id` ('server') | Reference to the associated server               |
| `name`        | `string`        | Name of the role                                 |
| `permissions` | `object`        | Permissions associated with the role (see below) |
| `createdBy`   | `string`        | ID of the user who created the role              |

#### Permissions:

`createChannel`: Create channels
`deleteChannel`: Delete channels
`updateChannel`: Update channels
`manageRoles`: Manage member roles
`sendMessage`: Send messages in channels
`deleteMessage`: Delete messages

### 4. [Member](membre.md)

Represents the members of the servers. Each member can have an associated role.

| Field      | Type            | Description                                |
| ---------- | --------------- | ------------------------------------------ |
| `serverId` | `id` ('server') | Reference to the associated server         |
| `userId`   | `string`        | ID of the user                             |
| `user`     | `string`        | Name of the user                           |
| `role`     | `id` ('role')   | (optional) Role associated with the member |

### 5. [Channel](channel.md)

Defines communication channels within servers. Channels can have different types and permissions.

| Field         | Type            | Description                                          |
| ------------- | --------------- | ---------------------------------------------------- |
| `serverId`    | `id` ('server') | Reference to the associated server                   |
| `name`        | `string`        | Name of the channel                                  |
| `type`        | `string`        | (optional) Type of channel (e.g., "text" or "voice") |
| `permissions` | `string`        | (optional) Specific permissions for the channel      |

### 6. [Message](message.md)

Represents the messages sent in channels
Messages can be edited or deleted

| Field        | Type               | Description                           |
| ------------ | ------------------ | ------------------------------------- |
| `channelId`  | `id` ('channel')   | Reference to the associated channel   |
| `userId`     | `string`           | ID of the user who sent the message   |
| `user`       | `string`           | Name of the user who sent the message |
| `content`    | `string`           | Content of the message                |
| `modified`   | `boolean`          | Indicates if the message was modified |
| `modifiedAt` | `number` or `null` | Timestamp of the last modification    |
| `deleted`    | `boolean`          | Indicates if the message was deleted  |

## Navigation

For more details on each table, click on the links below to access the specific documentation:

-   Server
-   [InvitCode](invitCode.md)
-   Role
-   [Member](membre.md)
-   [Channel](channel.md)
-   [Message](message.md)

Each table documentation provides detailed information about the fields, constraints, and relationships with other entities in the schema
