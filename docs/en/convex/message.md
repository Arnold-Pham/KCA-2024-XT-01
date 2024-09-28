# Documentation - Message Management

The `message` module allows for the management of messages within the channels of a server. It provides CRUD (Create, Read, Update, Delete) functionalities for the `message` table.

## Table `message`

### Structure

| Field        | Type            | Description                                                |
| ------------ | --------------- | ---------------------------------------------------------- |
| `channelId`  | `id('channel')` | Identifier of the channel where the message is posted      |
| `userId`     | `id('user')`    | Identifier of the user who sent the message                |
| `content`    | `string`        | Content of the message                                     |
| `modified`   | `boolean`       | Indicates if the message has been modified                 |
| `modifiedAt` | `number`/`null` | Timestamp of the last modification, `null` if not modified |
| `deleted`    | `boolean`       | Indicates if the message has been deleted                  |

### Validation Rules

-   **Content**:
    -   Must not be empty
    -   Maximum length is 3000 characters
-   **Author**:
    -   A message must be linked to a user who is a member of the server
    -   Only the author of the message or a moderator can modify or delete it

---

## CRUD Functionalities

### 1. `c` - Sending a Message _(Create)_

#### Description

Adds a new message to a specified channel of a server.

#### Arguments

-   `userId`: `id('user')` - Identifier of the user sending the message
-   `serverId`: `id('server')` - Identifier of the server to which the channel belongs
-   `channelId`: `id('channel')` - Identifier of the channel where the message will be posted
-   `content`: `string` - Content of the message

#### Behavior

-   **Validation**:
    -   Checks that the content is not empty and does not exceed 3000 characters
    -   Checks that the user, server, and channel exist
-   **Insertion**:
    -   If all checks pass, inserts the message into the `message` table with the provided information

#### Responses

-   **Success**:

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGE_SENT',
        details: 'Le message a bien été envoyé'
    }
    ```

-   **Errors**:
    -   `messageEmpty`: The message content is empty
    -   `messageTooLong`: The message content exceeds 3000 characters
    -   `unknownUser`: User not found
    -   `unknownServer`: Server not found
    -   `unknownChannel`: Channel not found

---

### 2. `l` - Retrieving Messages _(List)_

#### Description

Fetches the list of messages from a specified channel of a server
By default, returns the last 50 messages

#### Arguments

-   `userId`: `id('user')` - Identifier of the user requesting the messages
-   `serverId`: `id('server')` - Identifier of the server to which the channel belongs
-   `channelId`: `id('channel')` - Identifier of the channel from which messages should be retrieved

#### Behavior

-   **Validation**:
    -   Checks that the user, server, and channel exist
-   **Retrieval**:
    -   If all checks pass, retrieves the last 50 messages from the specified channel, sorted in reverse chronological order

#### Responses

-   **Success**: With `messagesWithName` representing the join between `user` and `message`

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGES_GATHERED',
        details: 'Les cinquante derniers messages ont été récupérés',
        data: messagesWithName.reverse()
    }
    ```

-   **Errors**:
    -   `unknownUser`: User not found
    -   `unknownServer`: Server not found
    -   `unknownChannel`: Channel not found

---

### 3. `u` - Modifying a Message _(Update)_

#### Description

Modifies the content of an existing message in a server channel.

#### Arguments

-   `userId`: `id('user')` - Identifier of the user modifying the message
-   `serverId`: `id('server')` - Identifier of the server to which the channel belongs
-   `channelId`: `id('channel')` - Identifier of the channel containing the message
-   `messageId`: `id('message')` - Identifier of the message to be modified
-   `content`: `string` - New content of the message

#### Behavior

-   **Validation**:
    -   Checks that the content is not empty and does not exceed 3000 characters
    -   Checks that the user, server, channel, and message exist
    -   Checks that the message is not already deleted
    -   Only the author of the message or a moderator can modify it
-   **Modification**:
    -   If all checks pass, updates the content of the message and indicates that it has been modified (`modified: true`, `modifiedAt: Date.now()`)

#### Responses

-   **Success**:

    ```javascript
    {
        status: 'success',
        code: 200,
        message: 'MESSAGE_UPDATED',
        details: 'Le message a bien été mis à jour'
    }
    ```

-   **Errors**:
    -   `messageEmpty`: The message content is empty
    -   `messageTooLong`: The message content exceeds 3000 characters
    -   `unknownUser`: User not found
    -   `unknownServer`: Server not found
    -   `unknownChannel`: Channel not found
    -   `unknownMessage`: Message not found
    -   `messageDeleted`: The message has already been deleted
    -   `messageNotAuthor`: Only the author of the message can modify it
    -   `messageUnchanged`: The content of the message is unchanged

---

### 4. `d` - Deleting a Message _(Delete)_

#### Description

Deletes an existing message in a server channel.

#### Arguments

-   `userId`: `id('user')` - Identifier of the user requesting the deletion
-   `serverId`: `id('server')` - Identifier of the server to which the channel belongs
-   `channelId`: `id('channel')` - Identifier of the channel containing the message
-   `messageId`: `id('message')` - Identifier of the message to be deleted

#### Behavior

-   **Validation**:
    -   Checks that the user, server, channel, and message exist
    -   Checks that the message is not already deleted
    -   Only the author of the message or a moderator can delete it
-   **Deletion**:
    -   If all checks pass, marks the message as deleted (`deleted: true`)

#### Responses

-   **Success**:

    ```javascript
    {
    	status: 'success',
    	code: 200,
    	message: 'MESSAGE_DELETED',
    	details: 'Le message a bien été supprimé'
    }
    ```

-   **Errors**:
    -   `unknownUser`: User not found
    -   `unknownServer`: Server not found
    -   `unknownChannel`: Channel not found
    -   `unknownMessage`: Message not found
    -   `messageDeleted`: The message has already been deleted
    -   `messageNotAuthor`: Only the author of the message can delete it

---

## Utility Functions - Error Handling and Data Verification

The `handleError` and `verifyUserServerChannel` functions are essential utilities that facilitate error handling and verification of user, server, and channel entities before executing mutations or queries. They are not directly associated with CRUD operations, but they play a crucial role in their proper functioning.

### 1. `handleError` - Error Handling

#### Description

The `handleError` function centralizes error management by returning a formatted error object with appropriate information. This function is used to intercept exceptions occurring during mutations and queries and to return a standardized error message.

#### Signature

```typescript
function handleError(error: unknown)
```

#### Behavior

-   The function checks if the captured error is an instance of `Error`
-   If so, it throws a new error with the details of the original error, using the following format:
    ```javascript
    {
      status: 'error',
      code: 500,
      message: 'SERVER_ERROR',
      details: 'Details of the captured error'
    }
    ```
-   If it is not an instance of `Error`, it returns a generic error object:
    ```javascript
    {
      status: 'error',
      code: 500,
      message: 'UNKNOWN_ERROR',
      details: 'String representation of the captured error'
    }
    ```
-   The function always rethrows an error (`throw`), meaning it interrupts the normal execution flow

#### Example of Use

This function is called in the `try/catch` blocks of mutations and queries to capture exceptions and return formatted errors uniformly

```typescript
try {
	// Code that may throw an error
} catch (error: unknown) {
	return handleError(error)
}
```

---

### 2. `verifyUserServerChannel` - Entity Verification

#### Description

The `verifyUserServerChannel` function checks that the user, server, member, and channel associated with an operation exist in the database. This verification is necessary before any modification or retrieval of messages to ensure the validity of the entities involved.

#### Signature

```typescript
async function verifyUserServerChannel(
	ctx: MutationCtx | QueryCtx,
	{ userId, serverId, channelId }: { userId: Id<'user'>; serverId: Id<'server'>; channelId: Id<'channel'> }
)
```

#### Arguments

-   `ctx`: Context of the mutation or query (`MutationCtx | QueryCtx`)
-   `{ userId, serverId, channelId }`: Object containing the identifiers of the user (`userId`), server (`serverId`), and channel (`channelId`) to verify

#### Behavior

1. **User Verification**:

    - Searches for the user in the `user` table using `userId`
    - If the user is not found, returns an `unknownUser` error:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_USER',
        	details: 'The specified user could not be found in the database'
        }
        ```

2. **Server Verification**:

    - Searches for the server in the `server` table using `serverId`
    - If the server is not found, returns an `unknownServer` error:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_SERVER',
        	details: 'The specified server could not be found in the list of available servers'
        }
        ```

3. **Member Verification**:

    - Checks that the user is a member of the server in the `member` table
    - If the member is not found, returns an `unknownMember` error:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_MEMBER',
        	details: 'The specified member is not part of the server'
        }
        ```

4. **Channel Verification**:

    - Searches for the channel in the `channel` table using `channelId`
    - If the channel is not found, returns an `unknownChannel` error:
        ```javascript
        {
        	status: 'error',
        	code: 404,
        	message: 'UNKNOWN_CHANNEL',
        	details: 'The specified channel could not be found in the server'
        }
        ```

5. **Return**:
    - If all checks pass, the function returns `null`, indicating that all entities are valid.

#### Example of Use

This function is called at the beginning of mutations and queries to ensure that the entities involved exist:

```typescript
const validationError = await verifyUserServerChannel(ctx, args)
if (validationError) return validationError
```

This allows stopping the execution of the operation in case of issues, preventing logical errors or unauthorized access.

---

## Error Management

The functions utilize a standardized error object to return consistent responses:

| Error Code         | Status | Message            | Additional Details                                                        |
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

Error responses always include an HTTP status (`code`) and a clear error message to facilitate debugging and understanding of the issue.
