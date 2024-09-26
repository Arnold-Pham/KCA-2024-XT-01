# Message Management

The `message` module manages the creation, retrieval, updating, and deletion of messages in the channels of a server
Below is a description of each available function and its operation

## Table

| Field        | Type               | Description                                 |
| ------------ | ------------------ | ------------------------------------------- |
| `channelId`  | `id` ('channel')   | ID of the channel where the message is sent |
| `userId`     | `string`           | ID of the user who sent the message         |
| `user`       | `string`           | Username of the user who sent the message   |
| `content`    | `string`           | Content of the message                      |
| `modified`   | `boolean`          | Indicates if the message has been modified  |
| `modifiedAt` | `number` or `null` | Timestamp of the last modification          |
| `deleted`    | `boolean`          | Indicates if the message has been deleted   |

## Features

### 1. `c` - Create a Message

#### Description

Creates a new message in a specified channel of a server

#### Arguments

`channelId`: Identifier of the channel where the message should be sent
`serverId`: Identifier of the server to which the channel belongs
`userId`: Identifier of the user sending the message
`user`: Username of the user sending the message
`content`: Content of the message (must be a non-empty string and not exceed 3000 characters)

#### Behavior

-   Validates the message content (non-empty and maximum length of 3000 characters)
-   Checks if the server, channel, and member exist
-   If all conditions are met, the message is inserted into the database with the following information:
    -   `channelId`, `userId`, `user`, `content`: Information provided by the frontend
    -   `modified`: `false` - Indicates that the message has not yet been modified
    -   `modifiedAt`: `null` - No initial modification date
    -   `deleted`: `false` - The message is not deleted

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Message sent' }`
-   **Errors**:
    -   `errors.empty`: The message content is empty
    -   `errors.tooLong`: The content exceeds 3000 characters
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`: The provided information is invalid

### 2. `l` - List Messages

#### Description

Retrieves a list of messages for a specific channel

#### Arguments

`channelId`: Identifier of the channel
`serverId`: Identifier of the server to which the channel belongs
`userId`: Identifier of the user requesting the messages

#### Behavior

-   Checks if the server, channel, and member exist
-   Retrieves the last 50 messages from the channel, sorted in descending order of creation
-   Returns the list of messages in chronological order

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Messages collected', data: messages }`
-   **Errors**:
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`: The provided information is invalid

### 3. `u` - Update a Message

#### Description

Updates the content of an existing message

#### Arguments

`messageId`: Identifier of the message to update
`channelId`: Identifier of the channel to which the message belongs
`serverId`: Identifier of the server
`userId`: Identifier of the user
`content`: New content of the message

#### Behavior

-   Validates the message content (non-empty and maximum length of 3000 characters)
-   Checks if the server, channel, member, and message exist
-   Checks if the user is the author of the message and/or has the necessary permissions
-   If all conditions are met, the message is updated with the new information:
    -   `content`: New content provided
    -   `modified`: `true` - The message has been modified
    -   `modifiedAt`: Current timestamp

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Message updated' }`
-   **Errors**:
    -   `errors.empty`: The message content is empty
    -   `errors.tooLong`: The content exceeds 3000 characters
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`, `errors.messageNotFound`: The provided information is invalid
    -   `errors.notAuthorized`: The user is not authorized to modify the message
    -   `errors.unchanged`: The message has not changed from the original
    -   `errors.deleted`: The message has already been deleted

### 4. `d` - Delete a Message

#### Description

Deletes (marks as deleted) an existing message

#### Arguments

`messageId`: Identifier of the message to delete
`channelId`: Identifier of the channel to which the message belongs
`serverId`: Identifier of the server
`userId`: Identifier of the user

#### Behavior

-   Checks if the server, channel, member, and message exist
-   Checks if the user is the author of the message or has the necessary permissions to delete the message
-   If all conditions are met, the message is marked as deleted:
    -   `deleted`: `true`
    -   `modifiedAt`: Current timestamp

Marking the message as deleted serves to retain a record of sent messages while hiding the content from display. Currently, this is primarily for moderation purposes

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Message deleted' }`
-   **Errors**:
    -   `errors.serverNotFound`, `errors.memberNotFound`, `errors.channelNotFound`, `errors.messageNotFound`: The provided information is invalid
    -   `errors.notAuthorized`: The user is not authorized to delete the message
    -   `errors.deleted`: The message has already been deleted

## Error Handling

The functions use a standardized error object to return consistent responses:

| Error Code               | Status | Message                   | Additional Details                               |
| ------------------------ | ------ | ------------------------- | ------------------------------------------------ |
| `errors.deleted`         | 400    | "Action refused"          | The message has already been deleted             |
| `errors.empty`           | 400    | "Message sending refused" | The message is empty or contains only spaces     |
| `errors.tooLong`         | 400    | "Message too long"        | The message exceeds 3000 characters              |
| `errors.unchanged`       | 400    | "Message unchanged"       | No change detected compared to the original      |
| `errors.notAuthorized`   | 403    | "Action refused"          | The user does not have the necessary permissions |
| `errors.serverNotFound`  | 404    | "Server not found"        | The specified server does not exist              |
| `errors.memberNotFound`  | 404    | "Member not found"        | The user is not a member of the server           |
| `errors.channelNotFound` | 404    | "Channel not found"       | The specified channel does not exist             |
| `errors.messageNotFound` | 404    | "Message not found"       | The specified message does not exist             |

Error responses always include an HTTP status (`code`) and a clear error message to facilitate debugging and understanding of the issue
