# Channel Management

The `channel` module manages the creation, reading, updating, and deletion of channels within a server
Below is a description of each available function and how it works

## Table

| Field         | Type               | Description                                          |
| ------------- | ------------------ | ---------------------------------------------------- |
| `serverId`    | `id` ('server')    | Reference to the associated server                   |
| `name`        | `string`           | Name of the channel                                  |
| `type`        | `string`           | (optional) Type of channel (e.g., "text" or "voice") |
| `permissions` | `string` or `null` | (optional) Specific permissions for the channel      |

## Features

### 1. `c` - Create a Channel

#### Description

Creates a new channel in a specified server

#### Arguments

`serverId`: Identifier of the server to which the channel should be added
`userId`: Identifier of the user creating the channel
`name`: Name of the channel (must be a non-empty string not exceeding 32 characters)
`type`: Type of the channel (text by default, can be voice or others)
`permissions`: (Optional) Specific permissions for the channel, in JSON format

#### Behavior

-   Checks if the channel name is valid (non-empty and maximum length of 32 characters)
-   Checks if the server and member exist
-   Checks the number of existing channels in the server (limited to 32 channels)
-   If all conditions are met, the channel is inserted into the database with the following information:
    -   `serverId`, `name`, `type`, `permissions`: Information provided by the frontend
    -   `type`: Defaults to text if not specified

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel created' }`
-   **Errors**:
    -   `errors.empty`: The channel name is empty
    -   `errors.tooLong`: The channel name exceeds 32 characters
    -   `errors.serverNotFound`: The specified server does not exist
    -   `errors.memberNotFound`: The specified member does not exist
    -   `errors.tooMany`: The server already contains the maximum number of channels

### 2. `l` - List Channels

#### Description

Retrieves the list of channels from a specified server

#### Arguments

`serverId`: Identifier of the server
`userId`: Identifier of the user requesting the channels

#### Behavior

-   Checks if the server and member exist
-   Retrieves all channels from the server
-   Returns the list of channels

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Channels collected', data: channels }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist
    -   `errors.memberNotFound`: The specified member does not exist

### 3. `u` - Update a Channel

#### Description

Updates the information of an existing channel

#### Arguments

`channelId`: Identifier of the channel to update
`serverId`: Identifier of the server
`userId`: Identifier of the user
`name`: New name of the channel (optional, must be a valid string)
`type`: New type of the channel (optional)
`permissions`: New permissions for the channel (optional)

#### Behavior

-   Checks if the channel name is valid (non-empty and maximum length of 32 characters)
-   Checks if the server, channel, and member exist
-   Checks if the user is the creator of the server or has the necessary permissions
-   If all conditions are met, the channel is updated with the new information:
    -   `name`, `type`, `permissions`: Updated information provided
-   If no change is detected, returns an error

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: 'Channel updated' }`
-   **Errors**:
    -   `errors.empty`: The channel name is empty
    -   `errors.tooLong`: The channel name exceeds 32 characters
    -   `errors.serverNotFound`: The specified server does not exist
    -   `errors.channelNotFound`: The specified channel does not exist
    -   `errors.notAuthorized`: The user does not have the necessary permissions
    -   `errors.unchanged`: No change detected from the original

### 4. `d` - Delete a Channel

#### Description

Permanently deletes an existing channel

#### Arguments

`channelId`: Identifier of the channel to delete
`serverId`: Identifier of the server
`userId`: Identifier of the user

#### Behavior

-   Checks if the server, channel, and member exist
-   Checks if the user is the creator of the server or has the necessary permissions
-   If all conditions are met, the channel and all its associated messages are deleted

#### Responses

-   **Success**: `{ status: 'success', code: 200, message: "Channel deleted and all its messages too" }`
-   **Errors**:
    -   `errors.serverNotFound`: The specified server does not exist
    -   `errors.channelNotFound`: The specified channel does not exist
    -   `errors.notAuthorized`: The user does not have the necessary permissions

## Error Handling

The functions use a standardized error object to return consistent responses:

| Error Code               | Status | Message                    | Additional Details                                         |
| ------------------------ | ------ | -------------------------- | ---------------------------------------------------------- |
| `errors.empty`           | 400    | "Message creation refused" | The channel name is empty or only contains spaces          |
| `errors.tooLong`         | 400    | "Message too long"         | The channel name exceeds 32 characters                     |
| `errors.unchanged`       | 400    | "Message unchanged"        | No change detected from the original                       |
| `errors.tooMany`         | 400    | "Too many channels"        | The server already contains the maximum number of channels |
| `errors.notAuthorized`   | 403    | "Action refused"           | The user does not have the necessary permissions           |
| `errors.serverNotFound`  | 404    | "Server not found"         | The specified server does not exist                        |
| `errors.memberNotFound`  | 404    | "Member not found"         | The specified member does not exist                        |
| `errors.channelNotFound` | 404    | "Channel not found"        | The specified channel does not exist                       |

Error responses always include an HTTP status (`code`) and a clear error message to facilitate debugging and understanding of the issue
